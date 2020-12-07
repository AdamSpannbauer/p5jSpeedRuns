import json
import datetime
from copy import deepcopy

from .constants import BLANK_SPLIT, TIME_FORMAT


def read_settings_file(path):
    with open(path, "r") as f:
        timer_settings = json.load(f)

    return (
        timer_settings["title"],
        timer_settings["splits"],
        timer_settings["prev_best_time"],
    )


def init_splits(splits, blank_split, time_now):
    split_names = list(splits.keys())
    blank_splits = {name: deepcopy(blank_split) for name in split_names}

    for split_name in split_names:
        blank_splits[split_name]["prev_best_time"] = splits[split_name]

    # Set first split start time to current time
    first_split = split_names[0]
    blank_splits[first_split]["start_time"] = time_now

    return blank_splits, split_names[0]


def init_timer_instance(title=None, split_names=None, settings_file=None):
    if settings_file is None and (title is None or split_names is None):
        raise ValueError(
            "Must provide either settings_file or both title and split_names"
        )

    # Take note of start time (cvt to str for write to json)
    now = datetime.datetime.utcnow().strftime(TIME_FORMAT)

    # Default to file input if avail
    if settings_file is not None:
        title, splits, prev_best_time = read_settings_file(settings_file)
    else:
        splits = {name: "-" for name in split_names}

    blank_splits, first_split_name = init_splits(splits, BLANK_SPLIT, now)

    timer_instance = {
        "title": title,
        "splits": blank_splits,
        "start_time": now,
        "end_time": "-",
        "total_elapsed_seconds": "-",
        "current_split": first_split_name,
    }

    return timer_instance


def create_timer(
    output_instance_file, title=None, split_names=None, input_settings_file=None
):
    timer_instance = init_timer_instance(
        title=title, split_names=split_names, settings_file=input_settings_file
    )

    with open(output_instance_file, "w") as f:
        json.dump(timer_instance, f, indent=2)


if __name__ == "__main__":
    create_timer(
        output_instance_file="../timer_instance.json",
        input_settings_file="../timer_settings.json",
    )
