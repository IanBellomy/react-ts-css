import React from "react";
import styles from "./DataAttributeHoverTest.module.css";

export const DataAttributeHoverTest = () => {
  return (
    <div className={styles.container}>
      {/* Test data attributes that should trigger hover */}
      <div data-testid="test-element" className={styles.testElement}>
        Hover over this data-testid attribute to see CSS styles
      </div>

      <button
        data-variant="primary"
        data-size="large"
        className={styles.button}
      >
        Hover over data-variant or data-size attributes
      </button>

      <div
        data-state="loading"
        data-theme="dark"
        className={styles.statusIndicator}
      >
        Hover over data-state or data-theme attributes
      </div>

      {/* Dynamic data attributes */}
      <div
        data-status="active"
        className={styles.status}
      >
        Hover over data-status attribute
      </div>
    </div>
  );
};