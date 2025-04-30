# Decision Table for nopCommerce Discount Logic

This table outlines the test cases for the discount logic based on the specified conditions.

**Conditions:**

*   C1: User is Logged In (Y/N)
*   C2: Coupon is Applied (Y/N)
*   C3: Cart Total >= $100 (Y/N)

**Actions:**

*   A1: Apply Discount (%)

**Rules:**

| Rule | C1: Logged In | C2: Coupon Applied | C3: Cart >= $100 | A1: Expected Discount | Notes                                         |
| :--- | :------------ | :----------------- | :---------------- | :-------------------- | :-------------------------------------------- |
| 1    | Y             | Y                  | Y                 | 20%                   | Given in assignment                           |
| 2    | Y             | Y                  | N                 | 0%                    | Assumed (Discount requires Cart >= $100)      |
| 3    | Y             | N                  | Y                 | 5%                    | Given in assignment                           |
| 4    | Y             | N                  | N                 | 0%                    | Assumed (Discount requires Cart >= $100)      |
| 5    | N             | Y                  | Y                 | 10%                   | Given in assignment                           |
| 6    | N             | Y                  | N                 | 0%                    | Assumed (Discount requires Cart >= $100)      |
| 7    | N             | N                  | Y                 | 0%                    | Assumed (No login/coupon = no discount)       |
| 8    | N             | N                  | N                 | 0%                    | Given in assignment (Baseline, no conditions met) |
