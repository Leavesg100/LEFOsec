# TODO - Fix shared Reviews on Netlify

## Step 1 ✅
Create Netlify Function endpoint to accept reviews and return stored reviews.

(Implemented Supabase-backed reads/writes with safe in-memory fallback.)

## Step 2
Update `index.html` feedback form submission to POST to the function (or add fetch-based submit) instead of localStorage.


## Step 3
Update `reviews.html` to fetch reviews from the function and render cards.

## Step 4
Remove/disable localStorage review logic (optional fallback).

## Step 5
Manual test:
- Submit review
- Open reviews page in a different browser
- Confirm review appears

