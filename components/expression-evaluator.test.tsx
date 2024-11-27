import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExpressionEvaluatorComponent from "@/components/expresstion-evaluator";

describe("Expression evaluator component", () => {
  test("should render the component", () => {
    render(<ExpressionEvaluatorComponent />);

    expect(screen.getByText(/Expression Evaluator/i)).toBeInTheDocument();
    expect(screen.getByText(/evaluate/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("should evaluate simple expression with default delimiter", async () => {
    render(<ExpressionEvaluatorComponent />);
    const input = screen.getByRole("textbox");
    const button = screen.getByText(/evaluate/i);

    await userEvent.type(input, "1,2,3,4");
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/10/i)).toBeInTheDocument();
    });
  });

  test("should evaluate expression with custom delimiter", async () => {
    render(<ExpressionEvaluatorComponent />);
    const input = screen.getByRole("textbox");
    const button = screen.getByText(/evaluate/i);

    await userEvent.type(
      input,
      `//;
      1;2;3;4`
    );
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/10/i)).toBeInTheDocument();
    });
  });

  test("should throw error for negative numbers", async () => {
    render(<ExpressionEvaluatorComponent />);
    const input = screen.getByRole("textbox");
    const button = screen.getByText(/evaluate/i);

    await userEvent.type(input, "1,2,3,-4");
    await userEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText(/Negative numbers are not allowed/i)
      ).toBeInTheDocument();
    });
  });

  test("should throw error for invalid tokens", async () => {
    render(<ExpressionEvaluatorComponent />);
    const input = screen.getByRole("textbox");
    const button = screen.getByText(/evaluate/i);

    await userEvent.type(input, "1,2,3-4");
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Invalid token/i)).toBeInTheDocument();
    });
  });

  test("should handle mixed delimiters correctly", async () => {
    render(<ExpressionEvaluatorComponent />);
    const input = screen.getByRole("textbox");
    const button = screen.getByText(/evaluate/i);

    await userEvent.type(
      input,
      `//;
      1,2;3,4`
    );
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/10/i)).toBeInTheDocument();
    });
  });
});
