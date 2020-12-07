import json
import datetime
from .constants import TIME_FORMAT


def read_settings_file(path):
    with open(path, "r") as f:
        timer_instance = json.load(f)

    return timer_instance


def get_current_split(timer_instance):
    split_names = list(timer_instance["splits"].keys())
    current_split_name = timer_instance["current_split"]

    if current_split_name in timer_instance["splits"]:
        try:
            next_split_name = split_names[split_names.index(current_split_name) + 1]
        except IndexError:
            next_split_name = None
    else:
        next_split_name = None

    return current_split_name, next_split_name


def elapsed_seconds(time_stamp, now=None):
    if now is None:
        now = datetime.datetime.utcnow()

    start_time = datetime.datetime.strptime(time_stamp, TIME_FORMAT)
    total_elapsed = (now - start_time).total_seconds()

    return total_elapsed


def perform_split(
    timer_instance, current_split_name=None, next_split_name=None, now=None
):
    if current_split_name is None:
        return
    else:
        current_split = timer_instance["splits"][current_split_name]

    if now is None:
        now = datetime.datetime.utcnow()
    now_str = now.strftime(TIME_FORMAT)

    total_elapsed = elapsed_seconds(time_stamp=timer_instance["start_time"], now=now)
    split_elapsed = elapsed_seconds(time_stamp=current_split["start_time"], now=now)

    timer_instance["total_elapsed_seconds"] = total_elapsed
    timer_instance["splits"][current_split_name]["elapsed_seconds"] = split_elapsed
    timer_instance["splits"][current_split_name]["end_time"] = now_str

    if next_split_name is None:
        timer_instance["current_split"] = "-"
        timer_instance["end_time"] = now_str
    else:
        timer_instance["splits"][next_split_name]["start_time"] = now_str
        timer_instance["current_split"] = next_split_name

    return timer_instance


def split_timer(instance_file):
    timer_instance = read_settings_file(instance_file)
    current_split_name, next_split_name = get_current_split(timer_instance)

    timer_instance = perform_split(
        timer_instance=timer_instance,
        current_split_name=current_split_name,
        next_split_name=next_split_name,
    )

    with open(instance_file, "w") as f:
        json.dump(timer_instance, f, indent=2)


if __name__ == "__main__":
    split_timer("../timer_instance.json")
