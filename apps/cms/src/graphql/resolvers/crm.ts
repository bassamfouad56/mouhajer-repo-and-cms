import { prisma } from '@/lib/prisma';

// Helper function to calculate lead score
function calculateLeadScore(lead: any): number {
  let score = 0;

  // Budget Range scoring
  const budgetScores: Record<string, number> = {
    'ultra_luxury': 30,
    'luxury': 20,
    'mid_range': 10,
    'economical': 5,
  };
  score += budgetScores[lead.budgetRange] || 0;

  // Timeline scoring
  const timelineScores: Record<string, number> = {
    'immediate': 25,
    '1_month': 20,
    '3_months': 15,
    '6_months': 10,
    'flexible': 5,
  };
  score += timelineScores[lead.timeline] || 0;

  // Source scoring
  const sourceScores: Record<string, number> = {
    'referral': 20,
    'walk_in': 15,
    'website': 10,
    'social_media': 5,
  };
  score += sourceScores[lead.source] || 0;

  // Contact quality
  if (lead.email && lead.phone) score += 10;
  else if (lead.phone) score += 5;

  return Math.min(score, 100); // Cap at 100
}

export const crmResolvers = {
  CrmActivity: {
    user: async (parent: any) => {
      const user = await prisma.user.findUnique({
        where: { id: parent.userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      });
      return user;
    },
  },

  Query: {
    // ========== LEADS ==========
    leads: async (_: any, { filter, limit = 50, offset = 0, orderBy = 'createdAt_desc' }: any) => {
      const where: any = {};

      if (filter) {
        if (filter.status) where.status = filter.status;
        if (filter.source) where.source = filter.source;
        if (filter.qualified !== undefined) where.qualified = filter.qualified;
        if (filter.projectType) where.projectType = filter.projectType;
        if (filter.budgetRange) where.budgetRange = filter.budgetRange;
        if (filter.city) where.city = filter.city;
        if (filter.assignedTo) where.assignedTo = filter.assignedTo;
        if (filter.minScore) where.score = { gte: filter.minScore };
        if (filter.maxScore) where.score = { ...where.score, lte: filter.maxScore };
        if (filter.search) {
          where.OR = [
            { name: { contains: filter.search, mode: 'insensitive' } },
            { email: { contains: filter.search, mode: 'insensitive' } },
            { phone: { contains: filter.search } },
          ];
        }
      }

      const [leads, total] = await Promise.all([
        prisma.lead.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.lead.count({ where }),
      ]);

      return {
        leads,
        total,
        hasMore: offset + limit < total,
      };
    },

    lead: async (_: any, { id }: any) => {
      return await prisma.lead.findUnique({ where: { id } });
    },

    leadsByStatus: async (_: any, { status }: any) => {
      return await prisma.lead.findMany({
        where: { status },
        orderBy: { score: 'desc' },
      });
    },

    myLeads: async (_: any, __: any, context: any) => {
      const userId = context.user?.id;
      if (!userId) return [];

      return await prisma.lead.findMany({
        where: { assignedTo: userId },
        orderBy: { score: 'desc' },
      });
    },

    leadStats: async () => {
      const [total, newCount, contacted, qualified, converted, lost] = await Promise.all([
        prisma.lead.count(),
        prisma.lead.count({ where: { status: 'new' } }),
        prisma.lead.count({ where: { status: 'contacted' } }),
        prisma.lead.count({ where: { qualified: true } }),
        prisma.lead.count({ where: { convertedToContact: true } }),
        prisma.lead.count({ where: { status: 'lost' } }),
      ]);

      const avgScore = await prisma.lead.aggregate({
        _avg: { score: true },
      });

      const bySource = await prisma.lead.groupBy({
        by: ['source'],
        _count: true,
      });

      const byStatus = await prisma.lead.groupBy({
        by: ['status'],
        _count: true,
      });

      return {
        total,
        new: newCount,
        contacted,
        qualified,
        converted,
        lost,
        averageScore: avgScore._avg.score || 0,
        conversionRate: total > 0 ? (converted / total) * 100 : 0,
        bySource: bySource.map((item: any) => ({
          source: item.source,
          count: item._count,
          percentage: (item._count / total) * 100,
        })),
        byStatus: byStatus.map((item: any) => ({
          status: item.status,
          count: item._count,
          percentage: (item._count / total) * 100,
        })),
      };
    },

    // ========== CONTACTS ==========
    contacts: async (_: any, { filter, limit = 50, offset = 0 }: any) => {
      const where: any = {};

      if (filter) {
        if (filter.type) where.type = filter.type;
        if (filter.status) where.status = filter.status;
        if (filter.vip !== undefined) where.vip = filter.vip;
        if (filter.city) where.city = filter.city;
        if (filter.assignedTo) where.assignedTo = filter.assignedTo;
        if (filter.companyId) where.companyId = filter.companyId;
        if (filter.search) {
          where.OR = [
            { firstName: { contains: filter.search, mode: 'insensitive' } },
            { lastName: { contains: filter.search, mode: 'insensitive' } },
            { email: { contains: filter.search, mode: 'insensitive' } },
            { phone: { contains: filter.search } },
          ];
        }
      }

      const [contacts, total] = await Promise.all([
        prisma.contact.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.contact.count({ where }),
      ]);

      return {
        contacts,
        total,
        hasMore: offset + limit < total,
      };
    },

    contact: async (_: any, { id }: any) => {
      return await prisma.contact.findUnique({
        where: { id },
        include: {
          company: true,
          deals: true,
          tasks: true,
          activities: true,
        },
      });
    },

    myContacts: async (_: any, __: any, context: any) => {
      const userId = context.user?.id;
      if (!userId) return [];

      return await prisma.contact.findMany({
        where: { assignedTo: userId },
        orderBy: { lastContactedAt: 'desc' },
      });
    },

    vipContacts: async () => {
      return await prisma.contact.findMany({
        where: { vip: true, status: 'active' },
        orderBy: { lastName: 'asc' },
      });
    },

    contactStats: async () => {
      const [total, active, inactive, vip] = await Promise.all([
        prisma.contact.count(),
        prisma.contact.count({ where: { status: 'active' } }),
        prisma.contact.count({ where: { status: 'inactive' } }),
        prisma.contact.count({ where: { vip: true } }),
      ]);

      const byCity = await prisma.contact.groupBy({
        by: ['city'],
        _count: true,
        where: { city: { not: null } },
      });

      const byType = await prisma.contact.groupBy({
        by: ['type'],
        _count: true,
      });

      return {
        total,
        active,
        inactive,
        vip,
        byCity: byCity.map((item: any) => ({
          city: item.city,
          count: item._count,
        })),
        byType: byType.map((item: any) => ({
          type: item.type,
          count: item._count,
        })),
      };
    },

    // ========== COMPANIES ==========
    companies: async (_: any, { limit = 50, offset = 0 }: any) => {
      return await prisma.company.findMany({
        take: limit,
        skip: offset,
        orderBy: { nameEn: 'asc' },
      });
    },

    company: async (_: any, { id }: any) => {
      return await prisma.company.findUnique({
        where: { id },
        include: {
          contacts: true,
          deals: true,
          leads: true,
        },
      });
    },

    // ========== DEALS ==========
    deals: async (_: any, { stage, assignedTo, limit = 50, offset = 0 }: any) => {
      const where: any = {};
      if (stage) where.stage = stage;
      if (assignedTo) where.assignedTo = assignedTo;

      const [deals, total] = await Promise.all([
        prisma.deal.findMany({
          where,
          take: limit,
          skip: offset,
          include: { contact: true, company: true },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.deal.count({ where }),
      ]);

      const totalValue = await prisma.deal.aggregate({
        where,
        _sum: { value: true },
      });

      return {
        deals,
        total,
        totalValue: totalValue._sum.value || 0,
        hasMore: offset + limit < total,
      };
    },

    deal: async (_: any, { id }: any) => {
      return await prisma.deal.findUnique({
        where: { id },
        include: {
          contact: true,
          company: true,
          tasks: true,
          activities: true,
        },
      });
    },

    dealsByStage: async (_: any, { stage }: any) => {
      return await prisma.deal.findMany({
        where: { stage },
        include: { contact: true },
        orderBy: { value: 'desc' },
      });
    },

    pipelineStats: async () => {
      const [deals, won, lost] = await Promise.all([
        prisma.deal.findMany(),
        prisma.deal.findMany({ where: { stage: 'won' } }),
        prisma.deal.count({ where: { stage: 'lost' } }),
      ]);

      const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
      const wonValue = won.reduce((sum, deal) => sum + deal.value, 0);
      const dealCount = deals.length;
      const wonCount = won.length;

      const byStage = await prisma.deal.groupBy({
        by: ['stage'],
        _count: true,
        _sum: { value: true },
        _avg: { probability: true },
      });

      return {
        totalValue,
        dealCount,
        wonValue,
        wonCount,
        lostCount: lost,
        winRate: dealCount > 0 ? (wonCount / dealCount) * 100 : 0,
        averageDealSize: dealCount > 0 ? totalValue / dealCount : 0,
        byStage: byStage.map((item: any) => ({
          stage: item.stage,
          count: item._count,
          value: item._sum.value || 0,
          probability: Math.round(item._avg.probability || 0),
        })),
      };
    },

    // ========== TASKS ==========
    tasks: async (_: any, { status, assignedTo, relatedTo, limit = 50, offset = 0 }: any) => {
      const where: any = {};
      if (status) where.status = status;
      if (assignedTo) where.assignedTo = assignedTo;
      if (relatedTo) where.relatedTo = relatedTo;

      return await prisma.task.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { dueDate: 'asc' },
      });
    },

    task: async (_: any, { id }: any) => {
      return await prisma.task.findUnique({ where: { id } });
    },

    myTasks: async (_: any, { status }: any, context: any) => {
      const userId = context.user?.id;
      if (!userId) return [];

      const where: any = { assignedTo: userId };
      if (status) where.status = status;

      return await prisma.task.findMany({
        where,
        orderBy: { dueDate: 'asc' },
      });
    },

    upcomingTasks: async (_: any, { days = 7 }: any, context: any) => {
      const userId = context.user?.id;
      if (!userId) return [];

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      return await prisma.task.findMany({
        where: {
          assignedTo: userId,
          status: { not: 'completed' },
          dueDate: {
            lte: futureDate,
          },
        },
        orderBy: { dueDate: 'asc' },
      });
    },

    // ========== ACTIVITIES ==========
    activities: async (_: any, { relatedTo, relatedId, limit = 50 }: any) => {
      return await prisma.crmActivity.findMany({
        where: { relatedTo, relatedId },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });
    },

    recentActivities: async (_: any, { limit = 20 }: any) => {
      return await prisma.crmActivity.findMany({
        take: limit,
        orderBy: { activityDate: 'desc' },
      });
    },

    // ========== UNIFIED CRM STATS ==========
    crmStats: async () => {
      const [totalLeads, totalContacts, totalDeals, wonDeals] = await Promise.all([
        prisma.lead.count(),
        prisma.contact.count(),
        prisma.deal.count(),
        prisma.deal.count({ where: { stage: 'won' } }),
      ]);

      const pipelineValueResult = await prisma.deal.aggregate({
        _sum: { value: true },
      });

      const pipelineValue = pipelineValueResult._sum.value || 0;
      const conversionRate = totalLeads > 0 ? (wonDeals / totalLeads) * 100 : 0;

      return {
        totalLeads,
        totalContacts,
        totalDeals,
        pipelineValue,
        wonDeals,
        conversionRate,
      };
    },

    // ========== CRM ANALYTICS ==========
    crmAnalytics: async () => {
      try {
        // Return sample data since we don't have actual CRM data yet
        const leadsOverTime = [
          { date: '01-15', leads: 5, converted: 1 },
          { date: '01-16', leads: 3, converted: 0 },
          { date: '01-17', leads: 7, converted: 2 },
          { date: '01-18', leads: 4, converted: 1 },
          { date: '01-19', leads: 6, converted: 1 },
          { date: '01-20', leads: 8, converted: 3 },
          { date: '01-21', leads: 2, converted: 0 },
        ];

        const pipelineByStage = [
          { stage: 'Initial Consultation', count: 12, value: 150000 },
          { stage: 'Site Visit', count: 8, value: 200000 },
          { stage: 'Proposal', count: 5, value: 300000 },
          { stage: 'Negotiation', count: 3, value: 180000 },
          { stage: 'Contract Sent', count: 2, value: 120000 },
        ];

        const conversionStats = [
          { name: 'Converted', value: 15 },
          { name: 'Not Converted', value: 35 },
        ];

        const revenueOverTime = [
          { month: 'Aug', revenue: 450000 },
          { month: 'Sep', revenue: 380000 },
          { month: 'Oct', revenue: 520000 },
          { month: 'Nov', revenue: 680000 },
          { month: 'Dec', revenue: 750000 },
          { month: 'Jan', revenue: 620000 },
        ];

        return {
          leadsOverTime,
          pipelineByStage,
          conversionStats,
          revenueOverTime,
        };
      } catch (error) {
        console.error('CRM Analytics error:', error);
        return {
          leadsOverTime: [],
          pipelineByStage: [],
          conversionStats: [],
          revenueOverTime: [],
        };
      }
    },
  },

  Mutation: {
    // ========== LEADS MUTATIONS ==========
    createLead: async (_: any, { input }: any) => {
      const score = calculateLeadScore(input);

      return await prisma.lead.create({
        data: {
          ...input,
          score,
          status: 'new',
        },
      });
    },

    updateLead: async (_: any, { id, input }: any) => {
      return await prisma.lead.update({
        where: { id },
        data: input,
      });
    },

    deleteLead: async (_: any, { id }: any) => {
      await prisma.lead.delete({ where: { id } });
      return true;
    },

    qualifyLead: async (_: any, { id }: any) => {
      return await prisma.lead.update({
        where: { id },
        data: {
          qualified: true,
          qualifiedAt: new Date(),
          status: 'qualified',
        },
      });
    },

    disqualifyLead: async (_: any, { id, reason }: any) => {
      return await prisma.lead.update({
        where: { id },
        data: {
          qualified: false,
          disqualifiedReason: reason,
          status: 'lost',
        },
      });
    },

    updateLeadScore: async (_: any, { id, score }: any) => {
      return await prisma.lead.update({
        where: { id },
        data: { score },
      });
    },

    updateLeadStatus: async (_: any, { id, status }: any) => {
      return await prisma.lead.update({
        where: { id },
        data: { status },
      });
    },

    assignLead: async (_: any, { id, userId }: any) => {
      return await prisma.lead.update({
        where: { id },
        data: { assignedTo: userId },
      });
    },

    convertLead: async (_: any, { id, createDeal, dealValue }: any, context: any) => {
      const lead = await prisma.lead.findUnique({ where: { id } });
      if (!lead) throw new Error('Lead not found');

      // Create contact
      const contact = await prisma.contact.create({
        data: {
          firstName: lead.name.split(' ')[0] || lead.name,
          lastName: lead.name.split(' ').slice(1).join(' ') || '',
          email: lead.email,
          phone: lead.phone,
          companyId: lead.companyId,
          city: lead.city,
          area: lead.area,
          source: lead.source,
          preferredStyle: lead.stylePreference,
          budgetRange: lead.budgetRange,
          projectType: lead.interestedIn,
          assignedTo: lead.assignedTo,
        },
      });

      let deal = null;
      if (createDeal) {
        deal = await prisma.deal.create({
          data: {
            titleEn: `${lead.projectType} - ${lead.name}`,
            contactId: contact.id,
            companyId: lead.companyId,
            value: dealValue || 0,
            stage: 'initial_consultation',
            probability: 10,
            source: lead.source,
            projectType: lead.projectType,
            propertySize: lead.propertySize,
            city: lead.city,
            area: lead.area,
            assignedTo: lead.assignedTo,
          },
        });
      }

      // Update lead as converted
      await prisma.lead.update({
        where: { id },
        data: {
          convertedToContact: true,
          convertedToDeal: createDeal,
          convertedAt: new Date(),
          status: 'won',
        },
      });

      return {
        contact,
        deal,
        success: true,
        message: 'Lead converted successfully',
      };
    },

    // ========== CONTACTS MUTATIONS ==========
    createContact: async (_: any, { input }: any) => {
      return await prisma.contact.create({
        data: input,
      });
    },

    updateContact: async (_: any, { id, input }: any) => {
      return await prisma.contact.update({
        where: { id },
        data: input,
      });
    },

    deleteContact: async (_: any, { id }: any) => {
      await prisma.contact.delete({ where: { id } });
      return true;
    },

    markVip: async (_: any, { id, vip }: any) => {
      return await prisma.contact.update({
        where: { id },
        data: { vip },
      });
    },

    assignContact: async (_: any, { id, userId }: any) => {
      return await prisma.contact.update({
        where: { id },
        data: { assignedTo: userId },
      });
    },

    // ========== COMPANIES MUTATIONS ==========
    createCompany: async (_: any, { input }: any) => {
      return await prisma.company.create({
        data: input,
      });
    },

    updateCompany: async (_: any, { id, input }: any) => {
      return await prisma.company.update({
        where: { id },
        data: input,
      });
    },

    deleteCompany: async (_: any, { id }: any) => {
      await prisma.company.delete({ where: { id } });
      return true;
    },

    // ========== DEALS MUTATIONS ==========
    createDeal: async (_: any, { input }: any) => {
      return await prisma.deal.create({
        data: {
          ...input,
          stage: input.stage || 'initial_consultation',
          probability: input.probability || 10,
        },
      });
    },

    updateDeal: async (_: any, { id, input }: any) => {
      return await prisma.deal.update({
        where: { id },
        data: input,
      });
    },

    deleteDeal: async (_: any, { id }: any) => {
      await prisma.deal.delete({ where: { id } });
      return true;
    },

    moveDealStage: async (_: any, { id, stage }: any, context: any) => {
      const probabilityMap: Record<string, number> = {
        initial_consultation: 10,
        site_visit: 20,
        design_proposal: 30,
        quotation: 40,
        negotiation: 60,
        contract_sent: 80,
        contract_signed: 90,
        won: 100,
        lost: 0,
      };

      // Get current deal to track previous stage
      const currentDeal = await prisma.deal.findUnique({ where: { id } });
      const previousStage = currentDeal?.stage;

      // Update deal
      const deal = await prisma.deal.update({
        where: { id },
        data: {
          stage,
          probability: probabilityMap[stage] || 50,
        },
      });

      // Auto-create activity for stage change
      if (context.user && previousStage !== stage) {
        const stageNames: Record<string, string> = {
          initial_consultation: 'Initial Consultation',
          site_visit: 'Site Visit',
          design_proposal: 'Design Proposal',
          quotation: 'Quotation',
          negotiation: 'Negotiation',
          contract_sent: 'Contract Sent',
          contract_signed: 'Contract Signed',
          won: 'Won',
          lost: 'Lost',
        };

        await prisma.crmActivity.create({
          data: {
            type: 'status_change',
            title: `Deal moved to ${stageNames[stage] || stage}`,
            description: `Stage changed from ${stageNames[previousStage || ''] || previousStage || 'none'} to ${stageNames[stage] || stage}`,
            relatedTo: 'deal',
            relatedId: id,
            dealId: id,
            userId: context.user.id,
            stage: stage,
            metadata: {
              previousStage: previousStage,
              newStage: stage,
            },
          },
        });
      }

      return deal;
    },

    closeDeal: async (_: any, { id, won, reason }: any) => {
      return await prisma.deal.update({
        where: { id },
        data: {
          stage: won ? 'won' : 'lost',
          probability: won ? 100 : 0,
          actualCloseDate: new Date(),
          wonReason: won ? reason : undefined,
          lostReason: !won ? reason : undefined,
        },
      });
    },

    // ========== TASKS MUTATIONS ==========
    createTask: async (_: any, { input }: any) => {
      return await prisma.task.create({
        data: {
          ...input,
          leadId: input.relatedTo === 'lead' ? input.relatedId : undefined,
          contactId: input.relatedTo === 'contact' ? input.relatedId : undefined,
          dealId: input.relatedTo === 'deal' ? input.relatedId : undefined,
        },
      });
    },

    updateTask: async (_: any, { id, input }: any) => {
      return await prisma.task.update({
        where: { id },
        data: input,
      });
    },

    deleteTask: async (_: any, { id }: any) => {
      await prisma.task.delete({ where: { id } });
      return true;
    },

    completeTask: async (_: any, { id, notes }: any) => {
      return await prisma.task.update({
        where: { id },
        data: {
          status: 'completed',
          completedAt: new Date(),
          completionNotes: notes,
        },
      });
    },

    // ========== ACTIVITIES MUTATIONS ==========
    createActivity: async (_: any, { input }: any, context: any) => {
      const userId = context.user?.id;
      if (!userId) throw new Error('Not authenticated');

      return await prisma.crmActivity.create({
        data: {
          ...input,
          userId,
          leadId: input.relatedTo === 'lead' ? input.relatedId : undefined,
          contactId: input.relatedTo === 'contact' ? input.relatedId : undefined,
          dealId: input.relatedTo === 'deal' ? input.relatedId : undefined,
        },
      });
    },

    addDealNote: async (_: any, { input }: any, context: any) => {
      const userId = context.user?.id;
      if (!userId) throw new Error('Not authenticated');

      return await prisma.crmActivity.create({
        data: {
          type: 'note',
          title: 'Note added',
          description: input.note,
          relatedTo: 'deal',
          relatedId: input.dealId,
          dealId: input.dealId,
          userId,
          stage: input.stage,
          metadata: {
            noteType: 'phase_note',
            phase: input.stage,
          },
        },
      });
    },

    logCall: async (_: any, args: any, context: any) => {
      const userId = context.user?.id;
      if (!userId) throw new Error('Not authenticated');

      const relatedTo = args.contactId ? 'contact' : args.leadId ? 'lead' : 'deal';
      const relatedId = args.contactId || args.leadId || args.dealId;

      return await prisma.crmActivity.create({
        data: {
          type: 'call',
          title: 'Phone Call',
          description: args.notes,
          duration: args.duration,
          relatedTo,
          relatedId,
          userId,
          leadId: args.leadId,
          contactId: args.contactId,
          dealId: args.dealId,
        },
      });
    },

    logEmail: async (_: any, args: any, context: any) => {
      const userId = context.user?.id;
      if (!userId) throw new Error('Not authenticated');

      const relatedTo = args.contactId ? 'contact' : args.leadId ? 'lead' : 'deal';
      const relatedId = args.contactId || args.leadId || args.dealId;

      return await prisma.crmActivity.create({
        data: {
          type: 'email',
          title: args.subject,
          description: args.body,
          relatedTo,
          relatedId,
          userId,
          leadId: args.leadId,
          contactId: args.contactId,
          dealId: args.dealId,
        },
      });
    },

    logMeeting: async (_: any, args: any, context: any) => {
      const userId = context.user?.id;
      if (!userId) throw new Error('Not authenticated');

      const relatedTo = args.contactId ? 'contact' : args.leadId ? 'lead' : 'deal';
      const relatedId = args.contactId || args.leadId || args.dealId;

      return await prisma.crmActivity.create({
        data: {
          type: 'meeting',
          title: 'Meeting',
          description: args.notes,
          duration: args.duration,
          relatedTo,
          relatedId,
          userId,
          leadId: args.leadId,
          contactId: args.contactId,
          dealId: args.dealId,
        },
      });
    },
  },
};
