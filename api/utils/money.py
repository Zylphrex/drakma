from moneyed import Money, CAD


class BalanceIntegrityException(Exception):
    pass


def zero_dollars(currency=CAD):
    return Money('0', currency)


def parse_money(string, currency=CAD):
    if string == '':
        return zero_dollars(currency=currency)

    multiplier = 1

    if string.startswith('-$'):
        multiplier = -1
        string = string[2:]

    if string.startswith('$'):
        string = string[1:]

    return multiplier * Money(string, currency)
