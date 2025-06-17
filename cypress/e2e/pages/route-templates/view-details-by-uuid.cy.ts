describe("Route Template View Page / ルートテンプレート表示ページ", () => {
  // Constants
  const INVALID_ROUTE_ID = "invalid-uuid-123";
  const FE_BACKEND_BASE_URL = Cypress.env("FE_BACKEND_BASE_URL");
  const FE_TIMEOUT = Cypress.env("FE_TIMEOUT");

  // Variables
  const timeout = FE_TIMEOUT;
  let validRouteId: string;

  before(() => {
    cy.fixture("valid-route-template-sample.cy.json").then((data) => {
      validRouteId = data.uuid;
    });
  });

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  context("Valid Route Template / 有効なルートテンプレート", () => {
    beforeEach(() => {
      cy.intercept("GET", `${FE_BACKEND_BASE_URL}/route_template/*/get`, {
        fixture: "valid-route-template-sample.cy.json",
        delay: 3000, // optional: simulate network latency
      }).as("getValidRoute");

      cy.visit("/route-templates/" + validRouteId, {
        timeout,
      });
    });

    it("should show loading spinner immediately on page load / ページ読み込み時にすぐにスピナーが表示されること", () => {
      cy.get('[data-testid="happy-pineapple-spinner"]').should("be.visible");
    });
  });

  context("Invalid Route Template / 無効なルートテンプレート", () => {
    beforeEach(() => {
      cy.intercept("GET", `${FE_BACKEND_BASE_URL}/route_template/*/get`, {
        statusCode: 404,
        body: {
          error: "Not Found",
          message: "Failed to load route template",
        },
      }).as("getInvalidRoute");

      cy.visit("/route-templates/" + INVALID_ROUTE_ID, {
        failOnStatusCode: false,
        timeout,
      });
    });

    it("should show error for invalid route template ID / 無効なIDの場合エラーが表示されること", () => {
      cy.get('[data-testid="custom-error"]').should("be.visible");

      cy.get('[data-testid="custom-md-editor"]').should("not.exist");
      cy.get('[data-testid="route-svg-diagram"]').should("not.exist");
    });

    it("should allow navigation back to home / ホームへのナビゲーションが可能であること", () => {
      cy.get('[data-testid="home-button"]')
        .should("exist")
        .should("be.visible")
        .should("not.be.disabled")
        .click();

      cy.url().should("include", "/");
    });
  });
});
