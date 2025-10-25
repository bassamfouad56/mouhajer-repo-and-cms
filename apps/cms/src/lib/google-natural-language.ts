import { google, language_v1 } from 'googleapis';
import { JWT } from 'google-auth-library';

// Interfaces
export interface SentimentResult {
  score: number; // -1.0 (negative) to 1.0 (positive)
  magnitude: number; // 0 to infinity (emotional intensity)
  label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
}

export interface Entity {
  name: string;
  type: string; // PERSON, LOCATION, ORGANIZATION, etc.
  salience: number; // 0 to 1 (importance)
  mentions: number;
  sentiment?: SentimentResult;
}

export interface SyntaxToken {
  text: string;
  partOfSpeech: string;
  lemma: string;
}

export interface ContentAnalysis {
  sentiment: SentimentResult;
  entities: Entity[];
  keywords: string[];
  categories?: Array<{ name: string; confidence: number }>;
  language: string;
}

// Service class
export class GoogleNaturalLanguageService {
  private language: language_v1.Language;
  private auth: JWT;

  constructor(clientEmail: string, privateKey: string) {
    this.auth = new JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    this.language = google.language({ version: 'v1', auth: this.auth });
  }

  // Analyze sentiment of text
  async analyzeSentiment(text: string): Promise<SentimentResult> {
    try {
      const response = await this.language.documents.analyzeSentiment({
        requestBody: {
          document: {
            content: text,
            type: 'PLAIN_TEXT',
          },
          encodingType: 'UTF8',
        },
      });

      const sentiment = response.data.documentSentiment;
      const score = sentiment?.score || 0;
      const magnitude = sentiment?.magnitude || 0;

      return {
        score,
        magnitude,
        label: this.getSentimentLabel(score, magnitude),
      };
    } catch (error) {
      console.error('Failed to analyze sentiment:', error);
      throw error;
    }
  }

  // Extract entities from text
  async analyzeEntities(text: string): Promise<Entity[]> {
    try {
      const response = await this.language.documents.analyzeEntitySentiment({
        requestBody: {
          document: {
            content: text,
            type: 'PLAIN_TEXT',
          },
          encodingType: 'UTF8',
        },
      });

      const entities = response.data.entities || [];

      return entities.map((entity) => ({
        name: entity.name || '',
        type: entity.type || 'UNKNOWN',
        salience: entity.salience || 0,
        mentions: entity.mentions?.length || 0,
        sentiment: entity.sentiment
          ? {
              score: entity.sentiment.score || 0,
              magnitude: entity.sentiment.magnitude || 0,
              label: this.getSentimentLabel(
                entity.sentiment.score || 0,
                entity.sentiment.magnitude || 0
              ),
            }
          : undefined,
      }));
    } catch (error) {
      console.error('Failed to analyze entities:', error);
      throw error;
    }
  }

  // Classify content into categories
  async classifyContent(text: string): Promise<Array<{ name: string; confidence: number }>> {
    try {
      const response = await this.language.documents.classifyText({
        requestBody: {
          document: {
            content: text,
            type: 'PLAIN_TEXT',
          },
        },
      });

      const categories = response.data.categories || [];

      return categories.map((category) => ({
        name: category.name || '',
        confidence: category.confidence || 0,
      }));
    } catch (error) {
      // Classification requires at least 20 tokens, so it may fail for short text
      console.error('Failed to classify content:', error);
      return [];
    }
  }

  // Perform comprehensive content analysis
  async analyzeContent(text: string): Promise<ContentAnalysis> {
    try {
      // Run all analyses in parallel
      const [sentimentResult, entities, categories, languageDetection] = await Promise.all([
        this.analyzeSentiment(text),
        this.analyzeEntities(text),
        this.classifyContent(text).catch(() => []),
        this.detectLanguage(text),
      ]);

      // Extract top keywords from entities (sorted by salience)
      const keywords = entities
        .filter((e) => e.salience > 0.01)
        .sort((a, b) => b.salience - a.salience)
        .slice(0, 10)
        .map((e) => e.name);

      return {
        sentiment: sentimentResult,
        entities,
        keywords,
        categories: categories.length > 0 ? categories : undefined,
        language: languageDetection,
      };
    } catch (error) {
      console.error('Failed to analyze content:', error);
      throw error;
    }
  }

  // Detect language
  private async detectLanguage(text: string): Promise<string> {
    try {
      // Extract first 100 chars for language detection
      const sample = text.substring(0, 100);

      // Simple heuristic - if mostly ASCII, assume English
      const asciiRatio = (sample.match(/[\x00-\x7F]/g)?.length || 0) / sample.length;

      if (asciiRatio > 0.8) {
        return 'en';
      }

      return 'unknown';
    } catch {
      return 'en'; // Default to English
    }
  }

  // Helper: Determine sentiment label
  private getSentimentLabel(
    score: number,
    magnitude: number
  ): 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED' {
    // High magnitude with mixed score indicates mixed sentiment
    if (magnitude > 3 && Math.abs(score) < 0.3) {
      return 'MIXED';
    }

    // Score-based classification
    if (score > 0.25) {
      return 'POSITIVE';
    } else if (score < -0.25) {
      return 'NEGATIVE';
    } else {
      return 'NEUTRAL';
    }
  }

  // Batch analyze sentiment for multiple texts
  async analyzeSentimentBatch(texts: string[]): Promise<SentimentResult[]> {
    try {
      const results = await Promise.all(texts.map((text) => this.analyzeSentiment(text)));
      return results;
    } catch (error) {
      console.error('Failed to batch analyze sentiment:', error);
      throw error;
    }
  }

  // Analyze review sentiment (specialized for reviews)
  async analyzeReview(
    reviewText: string,
    rating: number
  ): Promise<{
    sentiment: SentimentResult;
    matchesRating: boolean;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  }> {
    try {
      const sentiment = await this.analyzeSentiment(reviewText);

      // Check if sentiment matches the rating
      const expectedSentiment = this.ratingToExpectedSentiment(rating);
      const matchesRating = this.sentimentMatchesRating(sentiment.label, expectedSentiment);

      // Calculate confidence based on magnitude and score consistency
      let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
      if (sentiment.magnitude > 2 && Math.abs(sentiment.score) > 0.5) {
        confidence = 'HIGH';
      } else if (sentiment.magnitude < 1 || Math.abs(sentiment.score) < 0.2) {
        confidence = 'LOW';
      }

      return {
        sentiment,
        matchesRating,
        confidence,
      };
    } catch (error) {
      console.error('Failed to analyze review:', error);
      throw error;
    }
  }

  // Helper: Convert rating to expected sentiment
  private ratingToExpectedSentiment(rating: number): 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' {
    if (rating >= 4) return 'POSITIVE';
    if (rating <= 2) return 'NEGATIVE';
    return 'NEUTRAL';
  }

  // Helper: Check if sentiment matches rating
  private sentimentMatchesRating(
    sentimentLabel: string,
    expectedSentiment: string
  ): boolean {
    return sentimentLabel === expectedSentiment || sentimentLabel === 'MIXED';
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.analyzeSentiment('This is a test.');
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Factory function
export async function createNaturalLanguageService(
  clientEmail?: string,
  privateKey?: string
): Promise<GoogleNaturalLanguageService> {
  const email = clientEmail || process.env.GOOGLE_NL_CLIENT_EMAIL;
  const key = privateKey || process.env.GOOGLE_NL_PRIVATE_KEY;

  if (!email || !key) {
    throw new Error('Natural Language API credentials not configured');
  }

  return new GoogleNaturalLanguageService(email, key);
}
