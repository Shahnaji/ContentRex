#!/usr/bin/env python3
# Script to fix the corrupted index.tsx by removing duplicate code blocks

input_file = '/supabase/functions/server/index.tsx'
output_file = '/supabase/functions/server/index-fixed.tsx'

# Read the file
with open(input_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines in file: {len(lines)}")
print(f"Corruption zone: lines 290-609")

# Keep lines 1-289 and skip lines 290-609, then continue from 610
fixed_lines = lines[:289] + lines[609:]

print(f"Fixed file will have {len(fixed_lines)} lines (reduced by {len(lines) - len(fixed_lines)} lines)")

# Write the fixed file
with open(output_file, 'w', encoding='utf-8') as f:
    f.writelines(fixed_lines)

print(f"Fixed file written to: {output_file}")
print("Please review and then move to original location if correct.")
