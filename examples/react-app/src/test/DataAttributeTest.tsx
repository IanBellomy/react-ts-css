import React from "react";
import styles from "./DataAttributeTest.module.css";

export const DataAttributeTest = () => {
  return (
    <div className={styles.container}>
      {/* Example of data attributes in React */}
      <div data-testid="test-element" className={styles.testElement}>
        Test Element
      </div>

      <button
        data-variant="primary"
        data-size="large"
        className={styles.button}
      >
        Primary Button
      </button>

      <div
        data-state="loading"
        data-theme="dark"
        className={styles.statusIndicator}
      >
        Loading...
      </div>

      {/* Dynamic data attributes */}
      <div
        data-status={true ? "active" : "inactive"}
        className={styles.status}
      >
        Status
      </div>
    </div>
  );
};