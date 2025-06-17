// Import: node_modules
import * as d3 from "d3";

// Clear all the checkbox from the dom
export const clearMapCheckbox = () => {
  // Uncheck all checkboxes, with error handling
  try {
    // Select all checkboxes with the class '.node-checkbox input' and uncheck them
    d3.selectAll(".node-checkbox input")
      .property("checked", false)
      .each(function () {
        // Optional: Log each unchecked checkbox for debugging
        // console.log("Unchecked checkbox:", this);
      });
  } catch (error) {
    // Log error in case of issues while unchecking checkboxes
    console.error("Error unchecking checkboxes:", error);
  }
};
