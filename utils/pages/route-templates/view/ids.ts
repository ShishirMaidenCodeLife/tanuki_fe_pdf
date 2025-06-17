import * as T from "@/types";

// Extract the part of the ID based on the level
export const getNodeIdByGroup = (
  fullId: string,
  group: T.RFNodeDataType["group"],
): string => {
  const parts = fullId.split("_");

  switch (group) {
    case "grandparent":
      return parts[0]; // always exists

    case "parent":
      if (parts.length < 2) {
        throw new Error("Parent ID requested, but ID does not include parent");
      }

      return `${parts[0]}_${parts[1]}`;

    case "child":
      if (parts.length < 3) {
        throw new Error("Child ID requested, but ID does not include child");
      }

      return `${parts[0]}_${parts[1]}_${parts[2]}`;
    default:
      throw new Error("Invalid node group");
  }
};

// Generate a unique ID for each node based on its indices
export const generateRouteNodeId = (params: T.RFNodeIndicesType): string => {
  const { indexGrandparent, indexParent, indexChild } = params;

  // Pad the indices to ensure they are always three digits
  const pad = (n: number) => String(n).padStart(3, "0");

  //  Check if the grandparent index is provided
  if (indexGrandparent === null || indexGrandparent === undefined) {
    throw new Error("Grandparent index is required");
  }

  // Create the ID parts
  const parts: string[] = [pad(indexGrandparent)];

  // Check if the parent index is provided
  if (indexParent !== null && indexParent !== undefined) {
    parts.push(pad(indexParent));
  }

  // Check if the child index is provided
  if (indexChild !== null && indexChild !== undefined) {
    if (indexParent === null || indexParent === undefined) {
      throw new Error("Child index provided without a parent index");
    }

    // Add the child index to the ID parts
    parts.push(pad(indexChild));
  }

  return parts.join("_");
};

// Generate route node indices based on the provided parameters
export const generateRouteNodeIdx = (
  params: T.RFNodeIndicesType,
): {
  idx: {
    grandparent: string | null;
    parent: string | null;
    child: string | null;
  };
} => {
  const { indexGrandparent, indexParent, indexChild } = params;

  let grandparent: string | null = null;
  let parent: string | null = null;
  let child: string | null = null;

  try {
    if (indexGrandparent !== null && indexGrandparent !== undefined) {
      grandparent = generateRouteNodeId({ indexGrandparent });
    }

    if (
      indexGrandparent !== null &&
      indexGrandparent !== undefined &&
      indexParent !== null &&
      indexParent !== undefined
    ) {
      parent = generateRouteNodeId({ indexGrandparent, indexParent });
    }

    if (
      indexGrandparent !== null &&
      indexGrandparent !== undefined &&
      indexParent !== null &&
      indexParent !== undefined &&
      indexChild !== null &&
      indexChild !== undefined
    ) {
      child = generateRouteNodeId({
        indexGrandparent,
        indexParent,
        indexChild,
      });
    }
  } catch (e) {
    console.log("Some error occured", e);

    // If any unexpected error occurs, just default those values to null
    return {
      idx: {
        grandparent,
        parent,
        child,
      },
    };
  }

  return {
    idx: {
      grandparent,
      parent,
      child,
    },
  };
};

// Parse the route node ID to extract indices
export const parseRouteNodeId = (id: string): T.RFNodeIndicesType => {
  const parts = id.split("_").map((part) => parseInt(part, 10));

  if (parts.length < 1 || parts.length > 3 || parts.some(isNaN)) {
    throw new Error(`Invalid route node ID: ${id}`);
  }

  const [indexGrandparent, indexParent, indexChild] = parts;

  const result: T.RFNodeIndicesType = { indexGrandparent };

  if (indexParent !== undefined) result.indexParent = indexParent;
  if (indexChild !== undefined) result.indexChild = indexChild;

  return result;
};
