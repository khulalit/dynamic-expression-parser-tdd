import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";

import ExpressionEvaluator from "../lib/interpreter";

const expressionEvaluator = new ExpressionEvaluator();

describe("Unit test: interpreter functions/parts", () => {
  describe("tokenize", () => {
    test("should tokenize input with default delimiter", () => {
      expect(expressionEvaluator.tokenize("1,2,3,4")).toEqual({
        delimiter: ",",
        tokens: ["1", "2", "3", "4"],
      });
    });

    test("should tokenize input with new line char", () => {
      expect(expressionEvaluator.tokenize("1\n2\n3\n4")).toEqual({
        delimiter: ",",
        tokens: ["1", "2", "3", "4"],
      });
    });

    test("should tokenize input with new line char with , as well", () => {
      expect(expressionEvaluator.tokenize("1\n2\n3\n4")).toEqual({
        delimiter: ",",
        tokens: ["1", "2", "3", "4"],
      });
    });

    test("should tokenize input with custom delimiter", () => {
      expect(expressionEvaluator.tokenize("//-\n1-2-3-4")).toEqual({
        delimiter: "-",
        tokens: ["1", "2", "3", "4"],
      });
    });

    test("should handle input without numbers", () => {
      expect(expressionEvaluator.tokenize("//;\n")).toEqual({
        delimiter: ";",
        tokens: [""],
      });
    });
  });

  describe("parseTokens", () => {
    test("should parse valid tokens", () => {
      expect(expressionEvaluator.parseTokens(["1", "2", "3"])).toEqual([
        "1",
        "2",
        "3",
      ]);
    });

    test("should throw error for empty token", () => {
      expect(() => expressionEvaluator.parseTokens(["1", "", "3"])).toThrow(
        "Syntax Error: Empty token"
      );
    });

    test("should throw error for invalid tokens", () => {
      expect(() => expressionEvaluator.parseTokens(["1", "a", "3"])).toThrow(
        'Syntax Error: Invalid token "a"'
      );
    });
  });

  describe("validateTokens", () => {
    test("should validate numbers correctly", () => {
      expect(expressionEvaluator.validateTokens(["1", "2", "3"])).toEqual([
        1, 2, 3,
      ]);
    });

    test("should throw error for negative numbers", () => {
      expect(() =>
        expressionEvaluator.validateTokens(["1", "-2", "3"])
      ).toThrow('Semantic Error: Negative numbers are not allowed ("-2")');
    });

    test("should throw error for invalid numbers", () => {
      expect(() =>
        expressionEvaluator.validateTokens(["1", "abc", "3"])
      ).toThrow('Semantic Error: Unable to parse the number "abc"');
    });
  });

  describe("execute", () => {
    test("should sum numbers correctly", () => {
      expect(expressionEvaluator.execute([1, 2, 3])).toEqual(6);
    });

    test("should return 0 for empty input", () => {
      expect(expressionEvaluator.execute([])).toEqual(0);
    });
  });
});

// Integration test for the whole interpreter
describe("Interpreter End-to-End", () => {
  test("should evaluate simple expression with default delimiter", () => {
    expect(expressionEvaluator.add("1,2,3,4")).toEqual(10);
  });

  test("should evaluate expression with custom delimiter", () => {
    expect(expressionEvaluator.add("//-\n1-2-3-4")).toEqual(10);
  });

  test("should throw error for negative numbers", () => {
    expect(() => expressionEvaluator.add("1\n2\n-3\n4")).toThrow(
      'Semantic Error: Negative numbers are not allowed ("-3")'
    );
  });

  test("should throw error for invalid tokens", () => {
    expect(() => expressionEvaluator.add("1,2,a,4")).toThrow(
      'Syntax Error: Invalid token "a"'
    );
  });

  test("should handle mixed delimiters correctly", () => {
    expect(expressionEvaluator.add("1,2\n3,4")).toEqual(10);
  });
});
