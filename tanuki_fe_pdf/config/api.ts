import { parseRoutesValue } from "@/utils/methods/app";

// API endpoints that is exactly like in the API Gateway
export const API_ENDPOINTS = {
  roadmap: {
    ////////////////////////////
    // #region Non-auth routes
    ////////////////////////////

    getByRoleOrSkill: (roleOrSkill: string) => `roadmap/${roleOrSkill}`,

    // #endregion Non-auth routes
    ////////////////////////////
    ////////////////////////////
  },

  get_roadmap_titles_api: {
    ////////////////////////////
    // #region Non-auth routes
    ////////////////////////////

    getRoles: "get_roadmap_titles_api?opt_title=roles",
    // get_by_roles: "get_roadmap_titles_api?opt_title=roles-ssssssssssssss",
    // get_by_roles: "get_roadmap_titles_api?opt_title=skills",
    // #endregion Non-auth routes

    ////////////////////////////
    ////////////////////////////
  },

  "route-templates": {
    ////////////////////////////
    // #region Non-auth routes
    ////////////////////////////

    get: "route-templates",
    getByCategory: (category?: string) =>
      `route-templates?category=${category}`,
    getByUuid: (uuid?: string) => `route-templates/${uuid}`,

    // #endregion Non-auth routes
    ////////////////////////////
    ////////////////////////////
  },

  // routes in API Gateway
  routes: {
    ////////////////////////////
    // #region Non-auth routes
    ////////////////////////////

    get: "routes",

    ////////////////////////////
    // #region Non-auth routes
    ////////////////////////////
  },

  // generate_route in API Gateway
  generate_route: "generate_route",
};

export const getAiSingleCallBody = (routesValue: string) => {
  return {
    // nodes: [JSON.stringify(parseRoutesValue(routesValue))],
    // ai_call_option: 1,
    userInput: parseRoutesValue(routesValue),
    mapType: 1,
  };
};

// {
//   "nodes": ["frontend", "react", "vue"],
//   "ai_call_option": 1
// }
