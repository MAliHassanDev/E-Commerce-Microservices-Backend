import { sum } from "../../src/utils/middlewareUtils.ts"



describe("Sum Function", () => {
  
  test("Should return 4 when arguments are 2,2", () => {
    const result = sum(2, 2);
    expect(result).toBe(4);
  })
})