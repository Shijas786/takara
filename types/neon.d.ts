declare module 'neon' {
  export function neon(connectionString: string): NeonSQL;
  
  interface NeonSQL {
    (strings: TemplateStringsArray, ...values: any[]): Promise<any[]>;
  }
} 