import type { AIProvider, AICapability } from '../types.js';

export abstract class BaseAIProvider implements AIProvider {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly capabilities: AICapability[];

  abstract isAvailable(): boolean;
  abstract healthCheck(): Promise<boolean>;

  protected ensureCapability(capability: AICapability) {
    if (!this.capabilities.includes(capability)) {
      throw new Error(`Provider '${this.name}' (${this.id}) does not support capability: ${capability}`);
    }
  }
}
