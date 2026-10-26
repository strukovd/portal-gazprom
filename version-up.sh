#!/usr/bin/env bash
set -euo pipefail

# increment (по умолчанию +1)
INC="${1:-1}"
if ! [[ "$INC" =~ ^-?[0-9]+$ ]]; then
  echo "INC must be an integer (example: $0 1, $0 0 or $0 -1)" >&2
  exit 1
fi

# Текущая версия из package.json (формат x.y.z)
PREV_VERSION="$(grep -oP '"version"\s*:\s*"\K[0-9]+\.[0-9]+\.[0-9]+' package.json | head -n1)"
if [[ -z "${PREV_VERSION}" ]]; then
  echo "Can't read version from package.json" >&2
  exit 1
fi

# Инкрементим только patch (последнее число)
MAJOR_MINOR="$(echo "$PREV_VERSION" | grep -oP '^[0-9]+\.[0-9]+\.')"
PATCH="$(echo "$PREV_VERSION" | grep -oP '[0-9]+$')"
NEW_PATCH="$((PATCH + INC))"

# Защита от ухода patch в отрицательные числа
if [ "$NEW_PATCH" -lt 0 ]; then
  echo "Error: Resulting patch version cannot be negative ($NEW_PATCH)" >&2
  exit 1
fi

CUR_VERSION="${MAJOR_MINOR}${NEW_PATCH}"

# Обновляем version в package.json
sed -i -E "s/(\"version\"[[:space:]]*:[[:space:]]*\")[0-9]+\.[0-9]+\.[0-9]+(\")/\1${CUR_VERSION}\2/" package.json
echo "Build version upgraded: ${PREV_VERSION} -> ${CUR_VERSION}" >&2

echo "${CUR_VERSION}"