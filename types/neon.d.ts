declare module '@neondatabase/serverless' {
  export function neon(connectionString: string): NeonSQL;
  
  interface NeonSQL {
    (strings: TemplateStringsArray, ...values: any[]): Promise<any[]>;
  }
} 