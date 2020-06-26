from moneyed import Money, CAD


class BalanceIntegrityException(Exception):
    pass


def parse_money(string, currency=CAD):
    if string == '':
        return Money('0', currency)
    return Money(string, currency)
