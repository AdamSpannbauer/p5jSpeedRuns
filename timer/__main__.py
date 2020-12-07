import argparse

from .start_timer import create_timer
from .split_timer import split_timer


ap = argparse.ArgumentParser()
ap.add_argument(
    "--init", help="Initialize a timer instance", required=False, action="store_true"
)
ap.add_argument(
    "--split",
    help="Record a split in a timer instance",
    required=False,
    action="store_true",
)
ap.add_argument(
    "-s",
    "--settings",
    default="timer_settings.json",
    help="Timer settings JSON file (required only for --init)",
)
ap.add_argument(
    "-i",
    "--timer_instance",
    default="timer_instance.json",
    help="Timer instance JSON file (required only for --init and --split)",
)
args = vars(ap.parse_args())

if args["init"] and args["split"]:
    raise ValueError("Can't perform both --init and --split at once")
elif args["init"]:
    create_timer(
        output_instance_file=args["timer_instance"],
        input_settings_file=args["settings"],
    )
elif args["split"]:
    split_timer(instance_file=args["timer_instance"])
else:
    raise ValueError("Must provide either --init or --split to specify action")
