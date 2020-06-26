import csv
import io

from api.models import Account, AccountActivity


def csv_file_to_dicts(raw_file, fields):
    field_names = [field_name for field_name, _ in fields]
    contents = raw_file.read().decode('utf-8')
    csv_file = io.StringIO(contents)
    csv_reader = csv.DictReader(csv_file, fieldnames=field_names)

    field_parsers = {
        field_name: field_parser for field_name, field_parser in fields
    }

    dicts = [
        {
            field_name: field_parsers[field_name](field_value)
            for field_name, field_value in row.items()
        }
        for row in csv_reader
    ]

    return dicts
