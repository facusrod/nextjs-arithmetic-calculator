import React, { useEffect, useState } from "react";
import { OperationAPI } from "@/network/api";
import { OperationType } from "@/network/types";
import { NextPage } from "next";
import router from "next/router";
import { useAuth } from "@/context/authcontext";

const EMPTY_VALUE = "";

const Calculator: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [balance, setBalance] = useState<number>(0);
  const [firstOperand, setFirstOperand] = useState<string>(EMPTY_VALUE);
  const [secondOperand, setSecondOperand] = useState<string>(EMPTY_VALUE);

  const [currentText, setCurrentText] = useState<string>('0');
  const [currentOperation, setCurrentOperation] = useState<string>(EMPTY_VALUE);
  const [errorMessage, setErrorMessage] = useState<string>(EMPTY_VALUE);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user])

  const getOperandValue = (): [boolean, string] => {
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
    )
    .then((data) => {
      cleanValues(data.result.toString());
      setBalance(data.user_balance);
    })
    .catch(err => {
      cleanValues(EMPTY_VALUE);
      setErrorMessage(err.response.data.message);
    })
    .finally(() => setIsLoading(false));;
  }

  const executeEquals = () => {
    if (!firstOperand || !currentOperation || !secondOperand) {
      return;
    }

    executeRemoteOperation(parseFloat(firstOperand), parseFloat(secondOperand), currentOperation);
  }

  const handleFixBalance = () => {
    setIsLoading(true);
    OperationAPI.fixUserBalance()
    .then((data) => {
      cleanValues(EMPTY_VALUE);
      setBalance(data);
    })
    .catch(err => {
      setErrorMessage(err.response.data.message);
    })
    .finally(()=> setIsLoading(false));
  }

  const toggleSign = () => {
    let [useFirstOperand, operandValue] = getOperandValue();
    let value = (parseFloat(operandValue) * -1).toString();

    if (useFirstOperand) {
      setFirstOperand(value);
      setCurrentText(value);
    } else {
      setSecondOperand(value);
      setCurrentText(value);
    }
  }

  return (
    <div className="relative max-w-md mx-auto">
      <div className="calculator p-4 bg-black rounded-lg shadow-lg">
        {balance > 0 && (
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
        <div className="grid grid-cols-4 gap-3 mb-3">
          <div className="col-span-3 grid grid-cols-3 gap-3">
            <button
              key="clear"
              className="bg-red-500 text-white p-4 rounded-full hover:bg-red-400 text-xl"
              onClick={() => cleanValues(EMPTY_VALUE)}
            >
              AC
            </button>
            <button
              key="+/-"
              className="bg-gray-500 text-white p-4 rounded-full hover:bg-gray-400 text-xl"
              onClick={() => toggleSign()}
            >
              +/-
            </button>
            <button
              key="√"
              className="bg-gray-500 text-white p-4 rounded-full hover:bg-gray-400 text-xl"
              onClick={() => addOperation("√")}
            >
              √
            </button>
            {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
              <button
                key={num}
                className="bg-gray-800 text-white p-4 rounded-full hover:bg-gray-700 text-xl"
                onClick={() => addNumber(num)}
              >
                {num}
              </button>
            ))}
            <button
              key="R"
              className="bg-purple-500 text-white p-4 rounded-full hover:bg-purple-400 text-xl"
              onClick={() => addOperation("R")}
              disabled={isLoading}
            >
              R
            </button>
            <button
              key="0"
              className="bg-gray-800 text-white p-4 rounded-full hover:bg-gray-700 text-xl"
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
          </div>
          <div className="grid grid-rows-3 gap-3">
            {["/", "*", "-", "+"].map((op) => (
              <button
                key={op}
                className="bg-orange-500 text-white p-4 rounded-full hover:bg-orange-400 text-xl"
                onClick={() => addOperation(op)}
              >
                {op}
              </button>
            ))}
            <button
              key="equals"
              className="bg-green-500 text-white p-4 rounded-full hover:bg-green-400 text-xl row-span-2"
              onClick={() => executeEquals()}
              disabled={isLoading}
            >
              =
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 right-2 text-sm text-gray-400 cursor-pointer hover:underline">
          <a onClick={handleFixBalance}>
            <span>Do you need or want to add more balance to your account?</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Calculator;



