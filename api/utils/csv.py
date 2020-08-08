import csv
import io

from api.models import Account, AccountActivity


def csv_file_to_dicts(raw_file, field_parsers=None, detect_headers=False):
    # if detect_headers is False, we must define the field_parsers
    assert detect_headers or field_parsers is not None
    if field_parsers is None:
        field_parsers = {}

    contents = raw_file.read().decode('utf-8')
    csv_file = io.StringIO(contents)

    if detect_headers:
        csv_reader = csv.DictReader(csv_file)
    else:
        csv_reader = csv.DictReader(csv_file, fieldnames=field_parsers.keys())

    dicts = [
        {
            field_name: field_parsers.get(field_name, lambda x: x)(field_value)
            for field_name, field_value in row.items()
        }
        for row in csv_reader
    ]

    return dicts
