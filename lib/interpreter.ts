class ExpressionEvaluator {
  public tokenize(input: string): { delimiter: string; tokens: string[] } {
    if (/^\/\/.?\n/.test(input)) {
      const delimiter = input[2];
      input = input.slice(4);
      input = input.replaceAll(delimiter, ",");
      return { delimiter, tokens: input.split(/[\n,]/) };
    }
    return { delimiter: ",", tokens: input.split(/[\n,]/) };
  }

  public parseTokens(tokens: string[]): string[] {
    const parsedTokens: string[] = [];
    for (const token of tokens) {
      const trimmed = token.trim();
      if (trimmed === "") {
        throw new Error("Syntax Error: Empty token");
      }
      if (isNaN(Number(trimmed))) {
        throw new Error(`Syntax Error: Invalid token "${trimmed}"`);
      }
      parsedTokens.push(trimmed);
    }
    return parsedTokens;
  }

  public validateTokens(tokens: string[]): number[] {
    return tokens.map((token) => {
      const number = parseFloat(token);
      if (isNaN(number)) {
        throw new Error(
          `Semantic Error: Unable to parse the number "${token}"`
        );
      }
      if (number < 0) {
        throw new Error(
          `Semantic Error: Negative numbers are not allowed ("${number}")`
        );
      }
      return number;
    });
  }

  public execute(nums: number[]): number {
    return nums.reduce((sum, num) => sum + num, 0);
  }

  // main function
  public add(expression: string): number {
    try {
      const { tokens } = this.tokenize(expression);
      const parsedTokens = this.parseTokens(tokens);
      const numbers = this.validateTokens(parsedTokens);

      return this.execute(numbers);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error: ${error.message}`);
      }
      throw error;
    }
  }
}

export default ExpressionEvaluator;
