import React, { useState } from "react";
import { OperationAPI } from "../network/api";
import { OperationType } from "@/network/types";

const EMPTY_VALUE = "";

const Calculator: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [balance, setBalance] = useState<string>(EMPTY_VALUE);
  const [firstOperand, setFirstOperand] = useState<string>(EMPTY_VALUE);
  const [secondOperand, setSecondOperand] = useState<string>(EMPTY_VALUE);

  const [currentText, setCurrentText] = useState<string>('0');
  const [currentOperation, setCurrentOperation] = useState<string>(EMPTY_VALUE);
  const [errorMessage, setErrorMessage] = useState<string>(EMPTY_VALUE);

  const getOperandValue = (): any[] => {
    const useFirstOperand = currentOperation === EMPTY_VALUE;
    let operandValue = useFirstOperand ? firstOperand : secondOperand;
    operandValue = operandValue === EMPTY_VALUE ? "0" : operandValue;
    return [useFirstOperand, operandValue];
  }

  const containsDot = (operandValue: string): boolean => {
    return operandValue.indexOf(".") > 0;
  }

  const addNumber = (n: number) => {
    let [useFirstOperand, operandValue] = getOperandValue();

    const alreadyHasDot = containsDot(operandValue);
    const operandFloatValue = parseFloat(operandValue);

    if (!alreadyHasDot && operandFloatValue === 0 && n === 0) {
      operandValue = "0";
    } else {
      operandValue = operandValue + n.toString();
      operandValue = parseFloat(operandValue).toString();
    }

    const value = operandValue.toString();

    if (useFirstOperand) {
      setFirstOperand(value);
      setCurrentText(value);
    } else {
      setSecondOperand(value);
      setCurrentText(currentText + n.toString());
    }
  }

  const addDot = () => {
    const [useFirstOperand, operandValue] = getOperandValue();
    const alreadyHasDot = containsDot(operandValue);

    if (!alreadyHasDot) {
      const value = operandValue + ".";
      setCurrentText(currentText + ".");

      if (useFirstOperand) {
        setFirstOperand(value);
      } else {
        setSecondOperand(value);
      }
    }
  }

  const cleanValues = (currentText: string) => {
    setCurrentText(currentText ? currentText : '0');
    setFirstOperand(EMPTY_VALUE);
    setSecondOperand(EMPTY_VALUE);
    setCurrentOperation(EMPTY_VALUE);
    setErrorMessage(EMPTY_VALUE);
  }

  const addOperation = (op: string) => {
    if (op === "R") {
      executeRemoteOperation(null, null, op);
      return;
    }

    if (firstOperand === EMPTY_VALUE || currentOperation !== EMPTY_VALUE) {
      return;
    }

    if (op === "√") {
      executeRemoteOperation(parseFloat(firstOperand), null, op);
    } else {
      setCurrentText(firstOperand + op);
      setCurrentOperation(op);
    }
  }

  const executeRemoteOperation = (firstOperandValue: number | null, secondOperandValue: number | null, operator: string): void => {
    let operation: OperationType = OperationType.ADDITION;
    switch (operator) {
      case "+":
        operation = OperationType.ADDITION;
        break;
      case "-":
        operation = OperationType.SUBSTRACTION;
        break;
      case "*":
        operation = OperationType.MULTIPLICATION;
        break;
      case "/":
        operation = OperationType.DIVISION;
        break;
      case "R":
        operation = OperationType.RANDOM_STRING;
        break;
      case "√":
        operation = OperationType.SQUARE_ROOT;
        break;
    }

    setIsLoading(true);
    OperationAPI.executeOperation(
      operation,
      firstOperandValue,
      secondOperandValue
    ).then((data) => {
        cleanValues(data.result.toString());
        setBalance(data.user_balance.toString());
        setIsLoading(false);
    }).catch(err => {
        setErrorMessage(err.response.data.message);
        setIsLoading(false);
    });
  }

  const executeEquals = () => {
    if (!firstOperand || !currentOperation || !secondOperand) {
      return;
    }

    executeRemoteOperation(parseFloat(firstOperand), parseFloat(secondOperand), currentOperation);
  }

  return (
    <div className="calculator p-4 bg-black rounded-lg shadow-lg max-w-md mx-auto">
      {parseInt(balance) >= 0 && (
        <div className="mb-3">
          <label className="block text-left text-white">CURRENT BALANCE: {balance}</label>
        </div>
      )}
      {errorMessage && (
        <div className="mb-3">
          <div className="bg-red-500 text-white p-3 rounded">{errorMessage}</div>
        </div>
      )}
      <div className="mb-3">
        <input
          className="w-full p-4 text-right bg-gray text-white rounded text-2xl"
          placeholder={isLoading ? 'Processing operation...' : currentText}
          disabled
        />
      </div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {/* OPERATION SECTION */}
        {["+", "-", "*", "/"].map((op) => (
          <button
            key={op}
            className="bg-orange-500 text-white p-4 rounded-full hover:bg-orange-400 text-xl"
            onClick={() => addOperation(op)}
          >
            {op}
          </button>
        ))}
        <button
          key="clear"
          className="bg-red-500 text-white p-4 rounded-full hover:bg-red-400 text-xl"
          onClick={() => cleanValues(EMPTY_VALUE)}
        >
          C
        </button>
        {/* NUMBERS SECTION */}
        {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((num) => (
          <button
            key={num}
            className="bg-gray-800 text-white p-4 rounded-full hover:bg-gray-700 text-xl"
            onClick={() => addNumber(num)}
          >
            {num}
          </button>
        ))}
        <button
          key="√"
          className="bg-gray-800 text-white p-4 rounded-full hover:bg-gray-700 text-xl"
          onClick={() => addOperation("√")}
        >
          √
        </button>
        <button
          key="R"
          className="bg-gray-800 text-white p-4 rounded-full hover:bg-gray-700 text-xl"
          onClick={() => addOperation("R")}
        >
          R
        </button>
        <button
          key="0"
          className="bg-gray-800 text-white p-4 rounded-full hover:bg-gray-700 text-xl col-span-2"
          onClick={() => addNumber(0)}
        >
          0
        </button>
        <button
          key="dot"
          className="bg-gray-800 text-white p-4 rounded-full hover:bg-gray-700 text-xl"
          onClick={() => addDot()}
        >
          .
        </button>
        <button
          key="equals"
          className="bg-green-500 text-white p-4 rounded-full hover:bg-green-400 text-xl"
          onClick={() => executeEquals()}
        >
          =
        </button>
      </div>
    </div>
  );
}

export default Calculator;