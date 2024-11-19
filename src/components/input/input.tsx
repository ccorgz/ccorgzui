"use client";
import React, { useEffect, useRef, useState } from "react";
import "../../styles/input.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Defines the type of the input. (For a select input type, use the <Select /> component.)
   */
  type: "text" | "password" | "date" | "number";
  /**
   * Defines the icon to be rendered inside the input box.
   */
  icon?: any;
  /**
   * Defines the position the icon must be rendered inside the input box.
   */
  iconPosition?: "left" | "right";
  /**
   * Defines a function to be called when clicked in the input icon.
   */
  iconAction?: any;
  /**
   * Defines the text label to be displayed as a description outisde the input box.
   */
  label?: string;
  /**
   * Defines a custom width string value to be used in the input box.
   */
  width?: string;
  /**
   * Defines a custom React Ref variable to be set in the input.
   */
  inputRef?: React.Ref<any>;
  /**
   * Defines a string to be displayed as a placeholder in the input.
   */
  placeholder?: string;
  /**
   * Defines a custom object to control the input when it is set to be a password input type.
   */
  password?: {
    /**
     * Defines if will be displayed an option so the user can view the password informed.
     */
    seePwd?: boolean;
    /**
     * Defines the icon to be displayed to show the password.
     */
    onIcon?: any;
    /**
     * Defines the icon to be displayed to hide the password.
     */
    offIcon?: any;
  };
  /**
   * Defines a custom function to be called when a key is pressed in the input.
   */
  onKeyDown?: any;
  /**
   * Defines a custom size for the component. (md is set by default)
   */
  inputSize?: "sm" | "md";
  /**
   * Defines a custom className object to be set as the input box styles.
   */
  className?: any;
  /**
   * Defines a custom string value to be displayed bellow the input as a description of it.
   */
  description?: string;
  /**
   * Defines a custom color for the description.
   */
  descriptionColor?: "success" | "danger" | "info" | "warning" | "default";
  /**
   * Defines a custom color to serve as a status for the input value.
   */
  status?: "success" | "danger" | "info" | "warning" | "default";
  /**
   * Defines whether the width will be dynamic.
   */
  dynamic?: boolean
}

// EXPORTA COMPONENTE POR PADRÃO
const Input = ({
  onKeyDown,
  type,
  icon,
  iconPosition,
  iconAction,
  label,
  width,
  placeholder,
  password,
  inputSize,
  className,
  description,
  descriptionColor,
  inputRef,
  status,
  defaultValue,
  value,
  dynamic,
  onChange,
  ...rest
}: InputProps & Record<string, unknown>) => {
  const [seePwd, setSeePwd] = useState(false);
  const [inputValue, setInputValue] = useState<string>(
    String(defaultValue || value || "")
  );

  const inputBoxRef = useRef<any>(null);
  const inputDynamicRef = useRef<HTMLInputElement>(null);
  const spanDynamicRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (dynamic && (spanDynamicRef.current && inputDynamicRef.current && inputBoxRef.current)) {
      if (
        ((!defaultValue && !value) || String(value).length === 0) &&
        inputValue.length === 0 &&
        (!placeholder || placeholder.length === 0)
      ) {
        inputBoxRef.current.style.width = "5px";
      } else {
        inputBoxRef.current.style.width = `${spanDynamicRef.current.offsetWidth + 24}px`;
      }
    }
  }, [defaultValue, value, spanDynamicRef, inputDynamicRef, inputValue, inputBoxRef]);

  const handleDivClickActions = () => {
    if (
      inputBoxRef &&
      inputBoxRef.current &&
      (!status || status == "default")
    ) {
      inputBoxRef.current.classList.remove("r-input-focused");
      // inputBoxRef.current.classList.remove("r-box-shadow");
      inputBoxRef.current.classList.add("r-input-focused");
    }
  };

  const handleDivBlurActions = () => {
    if (inputBoxRef && inputBoxRef.current) {
      inputBoxRef.current.classList.remove("r-input-focused");
      // inputBoxRef.current.classList.add("r-box-shadow");
    }
  };

  return (
    <div className="r-input-main-box" style={{ width: width }}>
      {label && (
        <label
          className={`r-input-main-box-label r-status-${status ?? "default"}`}
        >
          {label}
        </label>
      )}
      <div
        {...rest}
        className={
          "r-input-box r-box-shadow " +
          ("r-input-" + (inputSize ?? "md")) +
          (" r-input-status-" + (status ?? "default")) +
          " " +
          (className ? className : "")
        }
        ref={inputBoxRef}
        onClick={() => {
          handleDivClickActions();
        }}
        onBlur={() => {
          handleDivBlurActions();
        }}
      >
        {icon &&
          (!iconPosition || (iconPosition && iconPosition == "left")) && (
            <span
              onClick={() =>
                iconAction ? iconAction() : handleDivBlurActions()
              }
            >
              {icon}
            </span>
          )}
        <input
          type={type == "password" && seePwd ? "text" : type}
          placeholder={placeholder ?? ""}
          {...rest}
          ref={inputRef ? inputRef : inputDynamicRef}
          onChange={(e) => {
            e.preventDefault();
            setInputValue(e.target.value);
            if(onChange) onChange(e);
          }}
          onKeyDown={onKeyDown}
          onClick={() => {
            handleDivClickActions();
          }}
          onBlur={() => {
            handleDivBlurActions();
          }}
          defaultValue={defaultValue}
          value={value || inputValue}
          className={dynamic ? "r-input-dynamic" : ""}
        />
        {
          dynamic && (
            <span
            ref={spanDynamicRef}
            className={"r-input-dynamic-span" + " " + className}
          >
            {value || inputValue || defaultValue || placeholder}
          </span>
          )
        }
        {password?.seePwd && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              setSeePwd(!seePwd);
            }}
            style={{ cursor: "pointer" }}
          >
            {seePwd ? password?.onIcon : password?.offIcon}{" "}
          </span>
        )}
        {icon && iconPosition && iconPosition == "right" && (
          <span
            onClick={() => (iconAction ? iconAction() : handleDivBlurActions())}
          >
            {icon}
          </span>
        )}
      </div>
      {description && description.length > 0 && (
        <span
          className={`r-input-box-description r-input-box-description-${
            descriptionColor ?? "default"
          }`}
        >
          {description}
        </span>
      )}
    </div>
  );
};

export default Input;
