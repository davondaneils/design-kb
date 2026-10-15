#!/usr/bin/env bash
# Contact sheet of a clip for review: sheet.sh <in.mp4> <out.jpg> [fps=2] [cols=6] [width=480] [start=0] [dur=all]
# Each tile is stamped with its time in seconds and its frame number at the sampled rate.
set -euo pipefail
in=$1; out=$2; fps=${3:-2}; cols=${4:-6}; w=${5:-480}; ss=${6:-0}; dur=${7:-}
n=$(ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets -of csv=p=0 "$in")
src=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$in" | awk -F/ '{print $1/($2?$2:1)}')
total=$(awk -v n="$n" -v s="$src" -v f="$fps" 'BEGIN{print int(n/s*f)+1}')
[ -n "$dur" ] && total=$(awk -v d="$dur" -v f="$fps" 'BEGIN{print int(d*f)+1}')
rows=$(( (total + cols - 1) / cols ))
t=(-ss "$ss"); [ -n "$dur" ] && t+=(-t "$dur")
ffmpeg -y -loglevel error "${t[@]}" -i "$in" -vf "fps=$fps,scale=$w:-2,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='%{eif\:t+$ss\:d}.%{eif\:mod((t+$ss)*100\,100)\:d\:2}s  f%{n}':x=6:y=6:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.7,tile=${cols}x${rows}:padding=4:color=gray" -frames:v 1 -q:v 4 "$out"
echo "$out ($total tiles)"
