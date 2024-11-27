"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ExpressionEvaluator from "@/lib/interpreter";
import { Textarea } from "./ui/textarea";

const ExpressionEvaluatorComponent = () => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pipeline, setPipeline] = useState<any>(null);

  const evaluator = new ExpressionEvaluator();

  const add = () => {
    try {
      setError(null);
      setResult(null);
      setPipeline(null);

      const { delimiter, tokens } = evaluator.tokenize(expression);

      const parsedTokens = evaluator.parseTokens(tokens);
      const numbers = evaluator.validateTokens(parsedTokens);
      const finalResult = evaluator.execute(numbers);

      setPipeline({
        delimiter,
        tokens,
        parsedTokens,
        numbers,
      });
      setResult(finalResult);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <main className="w-full max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Expression Evaluator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your expression (e.g., 1,2,3 or //;\n1;2;3)"
              className="whitespace-pre-wrap"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
            />
            <Button onClick={add}>Evaluate</Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div
          className="bg-red-100 text-red-600 p-4 rounded-md"
          data-testid="error"
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {result !== null && (
        <div
          className="bg-green-100 text-green-600 p-4 rounded-md"
          data-testid="result"
        >
          <strong>Result:</strong> {result}
        </div>
      )}

      {pipeline && (
        <Card>
          <CardHeader>
            <CardTitle>Interpreter Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-200 p-4 rounded-md text-sm">
              {JSON.stringify(pipeline, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </main>
  );
};

export default ExpressionEvaluatorComponent;
