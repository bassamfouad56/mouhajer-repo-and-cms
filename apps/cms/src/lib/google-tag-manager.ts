import { google } from 'googleapis';
import { prisma } from "./prisma";


export interface GTMConfig {
  client_email: string;
  private_key: string;
  project_id: string;
}

export class GoogleTagManagerService {
  private tagmanager: any = null;
  private config: GTMConfig | null = null;

  constructor(config?: GTMConfig) {
    if (config) {
      this.config = config;
      this.initializeClient();
    }
  }

  private initializeClient() {
    if (!this.config) {
      throw new Error('Google Tag Manager configuration is missing');
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: this.config.client_email,
        private_key: this.config.private_key.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/tagmanager.readonly',
        'https://www.googleapis.com/auth/tagmanager.edit.containers',
      ],
    });

    this.tagmanager = google.tagmanager({
      version: 'v2',
      auth,
    });
  }

  async loadConfigFromDatabase(accountId: string) {
    const account = await prisma.googleTagManagerAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error('Google Tag Manager account not found');
    }

    this.config = {
      client_email: account.clientEmail,
      private_key: account.privateKey,
      project_id: account.projectId,
    };

    this.initializeClient();
    return account;
  }

  async listAccounts() {
    if (!this.tagmanager) {
      throw new Error('GTM client not initialized');
    }

    const response = await this.tagmanager.accounts.list();
    return response.data.account || [];
  }

  async listContainers(accountPath: string) {
    if (!this.tagmanager) {
      throw new Error('GTM client not initialized');
    }

    const response = await this.tagmanager.accounts.containers.list({
      parent: accountPath,
    });

    return response.data.container || [];
  }

  async getContainer(containerPath: string) {
    if (!this.tagmanager) {
      throw new Error('GTM client not initialized');
    }

    const response = await this.tagmanager.accounts.containers.get({
      path: containerPath,
    });

    return response.data;
  }

  async listWorkspaces(containerPath: string) {
    if (!this.tagmanager) {
      throw new Error('GTM client not initialized');
    }

    const response = await this.tagmanager.accounts.containers.workspaces.list({
      parent: containerPath,
    });

    return response.data.workspace || [];
  }

  async listTags(workspacePath: string) {
    if (!this.tagmanager) {
      throw new Error('GTM client not initialized');
    }

    const response = await this.tagmanager.accounts.containers.workspaces.tags.list({
      parent: workspacePath,
    });

    return response.data.tag || [];
  }

  async listTriggers(workspacePath: string) {
    if (!this.tagmanager) {
      throw new Error('GTM client not initialized');
    }

    const response = await this.tagmanager.accounts.containers.workspaces.triggers.list({
      parent: workspacePath,
    });

    return response.data.trigger || [];
  }

  async listVariables(workspacePath: string) {
    if (!this.tagmanager) {
      throw new Error('GTM client not initialized');
    }

    const response = await this.tagmanager.accounts.containers.workspaces.variables.list({
      parent: workspacePath,
    });

    return response.data.variable || [];
  }

  async syncContainers(dbAccountId: string, accountPath: string) {
    try {
      const containers = await this.listContainers(accountPath);

      for (const container of containers) {
        const containerId = container.containerId || container.path?.split('/').pop();

        await prisma.gTMContainer.upsert({
          where: {
            accountId_containerId: {
              accountId: dbAccountId,
              containerId: containerId,
            },
          },
          update: {
            containerName: container.name,
            publicId: container.publicId,
            usageContext: container.usageContext || [],
            domainName: container.domainName || [],
            notes: container.notes,
            updatedAt: new Date(),
          },
          create: {
            accountId: dbAccountId,
            containerId: containerId,
            containerName: container.name,
            publicId: container.publicId,
            usageContext: container.usageContext || [],
            domainName: container.domainName || [],
            notes: container.notes,
          },
        });
      }

      await prisma.googleTagManagerAccount.update({
        where: { id: dbAccountId },
        data: {
          lastSyncAt: new Date(),
          syncStatus: 'success',
          syncErrorMessage: null,
        },
      });

      return { success: true, count: containers.length };
    } catch (error: any) {
      await prisma.googleTagManagerAccount.update({
        where: { id: dbAccountId },
        data: {
          syncStatus: 'error',
          syncErrorMessage: error.message,
        },
      });

      throw error;
    }
  }

  async syncTags(dbContainerId: string, workspacePath: string) {
    try {
      const tags = await this.listTags(workspacePath);

      for (const tag of tags) {
        const tagId = tag.tagId || tag.path?.split('/').pop();

        await prisma.gTMTag.upsert({
          where: {
            containerId_tagId: {
              containerId: dbContainerId,
              tagId: tagId,
            },
          },
          update: {
            name: tag.name,
            type: tag.type,
            firingRules: tag.firingTriggerId || [],
            priority: tag.priority?.value,
            paused: tag.paused || false,
            notes: tag.notes,
            parameter: tag.parameter || null,
            updatedAt: new Date(),
          },
          create: {
            containerId: dbContainerId,
            tagId: tagId,
            name: tag.name,
            type: tag.type,
            firingRules: tag.firingTriggerId || [],
            priority: tag.priority?.value,
            paused: tag.paused || false,
            notes: tag.notes,
            parameter: tag.parameter || null,
          },
        });
      }

      return { success: true, count: tags.length };
    } catch (error: any) {
      throw error;
    }
  }

  async syncTriggers(dbContainerId: string, workspacePath: string) {
    try {
      const triggers = await this.listTriggers(workspacePath);

      for (const trigger of triggers) {
        const triggerId = trigger.triggerId || trigger.path?.split('/').pop();

        await prisma.gTMTrigger.upsert({
          where: {
            containerId_triggerId: {
              containerId: dbContainerId,
              triggerId: triggerId,
            },
          },
          update: {
            name: trigger.name,
            type: trigger.type,
            filter: trigger.filter || null,
            autoEventFilter: trigger.autoEventFilter || null,
            updatedAt: new Date(),
          },
          create: {
            containerId: dbContainerId,
            triggerId: triggerId,
            name: trigger.name,
            type: trigger.type,
            filter: trigger.filter || null,
            autoEventFilter: trigger.autoEventFilter || null,
          },
        });
      }

      return { success: true, count: triggers.length };
    } catch (error: any) {
      throw error;
    }
  }

  async syncVariables(dbContainerId: string, workspacePath: string) {
    try {
      const variables = await this.listVariables(workspacePath);

      for (const variable of variables) {
        const variableId = variable.variableId || variable.path?.split('/').pop();

        await prisma.gTMVariable.upsert({
          where: {
            containerId_variableId: {
              containerId: dbContainerId,
              variableId: variableId,
            },
          },
          update: {
            name: variable.name,
            type: variable.type,
            parameter: variable.parameter || null,
            updatedAt: new Date(),
          },
          create: {
            containerId: dbContainerId,
            variableId: variableId,
            name: variable.name,
            type: variable.type,
            parameter: variable.parameter || null,
          },
        });
      }

      return { success: true, count: variables.length };
    } catch (error: any) {
      throw error;
    }
  }

  async syncAll(dbAccountId: string, accountPath: string) {
    try {
      // Sync containers first
      const containersResult = await this.syncContainers(dbAccountId, accountPath);

      // Get all containers from database
      const containers = await prisma.gTMContainer.findMany({
        where: { accountId: dbAccountId },
      });

      // Sync tags, triggers, and variables for each container
      for (const container of containers) {
        const workspaces = await this.listWorkspaces(
          `${accountPath}/containers/${container.containerId}`
        );

        // Use the first workspace (usually "Default Workspace")
        if (workspaces.length > 0) {
          const workspacePath = workspaces[0].path;

          await this.syncTags(container.id, workspacePath);
          await this.syncTriggers(container.id, workspacePath);
          await this.syncVariables(container.id, workspacePath);
        }
      }

      return {
        success: true,
        containersCount: containersResult.count,
        containers: containers.length,
      };
    } catch (error: any) {
      throw error;
    }
  }
}

export const googleTagManagerService = new GoogleTagManagerService();
