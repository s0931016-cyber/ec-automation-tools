#!/usr/bin/env python3
"""Simple EC profit calculator.

Usage:
    python scripts/profit_calculator.py --sale 35000 --cost 15000 --shipping 1200 --fee-rate 0.10
"""

import argparse


def calculate_profit(sale: float, cost: float, shipping: float, fee_rate: float, other: float) -> dict:
    fee = sale * fee_rate
    profit = sale - cost - shipping - fee - other
    margin = profit / sale if sale else 0
    return {
        "sale": sale,
        "cost": cost,
        "shipping": shipping,
        "fee": fee,
        "other": other,
        "profit": profit,
        "margin": margin,
    }


def yen(value: float) -> str:
    return f"JPY {value:,.0f}"


def main() -> None:
    parser = argparse.ArgumentParser(description="Calculate EC item profit.")
    parser.add_argument("--sale", type=float, required=True, help="Sale price")
    parser.add_argument("--cost", type=float, required=True, help="Item and parts cost")
    parser.add_argument("--shipping", type=float, default=0, help="Shipping cost")
    parser.add_argument("--fee-rate", type=float, default=0.10, help="Platform fee rate, e.g. 0.10")
    parser.add_argument("--other", type=float, default=0, help="Other costs")
    args = parser.parse_args()

    result = calculate_profit(args.sale, args.cost, args.shipping, args.fee_rate, args.other)

    print("Profit calculation")
    print("------------------")
    print(f"Sale:     {yen(result['sale'])}")
    print(f"Cost:     {yen(result['cost'])}")
    print(f"Shipping: {yen(result['shipping'])}")
    print(f"Fee:      {yen(result['fee'])}")
    print(f"Other:    {yen(result['other'])}")
    print(f"Profit:   {yen(result['profit'])}")
    print(f"Margin:   {result['margin']:.1%}")


if __name__ == "__main__":
    main()
