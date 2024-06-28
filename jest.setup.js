import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();
// import "jest-fetch-mock";

// // Enable fetch mocks globally
// // eslint-disable-next-line no-undef
// global.fetch = require("jest-fetch-mock");
// fetch.enableMocks();

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      replace: jest.fn(),
      pathname: "/",
      route: "/",
      asPath: "/",
      query: {},
    };
  },
}));
