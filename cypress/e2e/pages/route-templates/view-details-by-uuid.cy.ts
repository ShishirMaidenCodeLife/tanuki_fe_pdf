describe("Route Template View Page / ルートテンプレート表示ページ", () => {
  let validRouteId: string;
  const INVALID_ROUTE_ID = "invalid-uuid-123";
  const TIMEOUT = 10000;

  before(() => {
    cy.fixture("view-details-by-uuid.cy.json").then((data) => {
      validRouteId = data.uuid;
    });
  });

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  context("Valid Route Template / 有効なルートテンプレート", () => {
    beforeEach(() => {
      cy.intercept("GET", `${Cypress.env("apiUrl")}/route_template/*/get`, {
        fixture: "view-details-by-uuid.cy.json",
      }).as("getValidRoute");

      cy.visit("/route-templates/" + validRouteId, {
        timeout: TIMEOUT,
      });
    });

    it("should load the route template page successfully / ルートテンプレートページが正常に読み込まれること", () => {
      cy.get('[data-testid="happy-pineapple-spinner"]', {
        timeout: TIMEOUT,
      }).should("exist");

      cy.get('[data-testid="custom-md-editor"]').should("be.visible");
      cy.get('[data-testid="route-svg-diagram"]').should("be.visible");
      cy.get(".react-flow").should("be.visible");
    });

    it("should display route content correctly / ルートの内容が正しく表示されること", () => {
      cy.get('[data-testid="custom-md-editor"]')
        .should("be.visible")
        .should("contain", "React Component Architecture");

      cy.get(".react-flow__node", {
        timeout: TIMEOUT,
      }).should("have.length.at.least", 1);

      cy.get(".react-flow__edge", {
        timeout: TIMEOUT,
      }).should("have.length.at.least", 1);
    });

    it("should allow interaction with the diagram / ダイアグラムと対話できること", () => {
      cy.get(".react-flow", {
        timeout: TIMEOUT,
      }).should("be.visible");

      cy.get(".react-flow__controls-fitview")
        .should("be.visible")
        .should("not.be.disabled")
        .click();

      cy.get(".react-flow__controls-zoomin")
        .should("be.visible")
        .should("not.be.disabled")
        .click();

      cy.get(".react-flow__controls-zoomout")
        .should("be.visible")
        .should("not.be.disabled")
        .click();
    });
  });

  context("Invalid Route Template / 無効なルートテンプレート", () => {
    beforeEach(() => {
      cy.intercept("GET", `${Cypress.env("apiUrl")}/route_template/*/get`, {
        statusCode: 404,
        body: {
          error: "Not Found",
          message: "Failed to load route template",
        },
      }).as("getInvalidRoute");

      cy.visit("/route-templates/" + INVALID_ROUTE_ID, {
        failOnStatusCode: false,
        timeout: TIMEOUT,
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
