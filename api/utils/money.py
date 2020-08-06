from moneyed import Money, CAD


class BalanceIntegrityException(Exception):
    pass


def zero_dollars(currency=CAD):
    return Money('0', currency)


def parse_money(string, currency=CAD):
    if string == '':
        return zero_dollars(currency=currency)
    return Money(string, currency)
