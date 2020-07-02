import re

from datetime import datetime, timedelta


RELATIVE_DATE_PATTERN = re.compile('^([0-9]+)([d])$')
RELATIVE_DATE_UNITS = {
    'd': 'days',
}


def today():
    now = datetime.now()
    return now.replace(hour=0, minute=0, second=0, microsecond=0)


def parse_relative_date(date):
    match = RELATIVE_DATE_PATTERN.fullmatch(date)
    if match is None:
        raise ValueError(f'Invalid relative date: {date}')

    count, unit = match.groups()
    count = int(count)
    unit = RELATIVE_DATE_UNITS[unit]

    return today() - timedelta(**{unit: count})
