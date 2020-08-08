import re

from datetime import datetime, timedelta

import pytz


class UnknownTimeException(Exception):
    pass


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


def parse_datetime(datetime_str, timezone=pytz.timezone('America/Toronto')):
    return datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S').replace(tzinfo=timezone)


def parse_datetime_or_default(datetime_str, default=None, timezone=pytz.timezone('America/Toronto')):
    try:
        return parse_datetime(datetime_str, timezone=timezone)
    except:
        return default


def parse_duration(duration):
    parts = duration.split(':')
    if len(parts) != 2:
        raise UnknownTimeException(
            f'Expect time to contain exactly one `:` but found {len(parts) - 1}: {duration}'
        )

    minutes, seconds = parts
    try:
        minutes = int(minutes)
        seconds = int(seconds)
        if seconds >= 60:
            assert False
    except ValueError:
        raise UnknownTimeException(
            f'Expected time to be of form XX:XX but found: {duration}'
        )

    return timedelta(minutes=minutes, seconds=seconds)


def parse_duration_or_default(duration, default=timedelta(seconds=0)):
    try:
        return parse_duration(duration)
    except:
        return default
