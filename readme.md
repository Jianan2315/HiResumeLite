# Intro for current directory(vanilla) structure:
- This branch is initialized by Hayeresume vanilla branch(03c856971c8d95133206b56b773507250bf0d48f). 
- Here is just css, html and JavaScript without any fancy framework.
- `plainClient` contains core functionalities in vanilla JavaScript framework.

# How to use:
1) Download and unzip.
2) Double-click 'templateSelect.html'(unnecessary, but I keep it) or 'edit.html'.

# Dev Track:
## 9/30/2025
1) Working on 'Archive' and 'Retrieve' functions
2) simplify html code

## 9/29/2025
1) add new icons
2) add one more container ('history') to main window (current: 'form' and 'preview')
3) Debug 0*0 icon caused by no fontawesome pro. '/\'
4) Working on 'Archive' and 'Retrieve' functions

## 9/28/2025
1) Plan:
   - replace current iteration bindings with event delegation
   - add 'history' record for each section
   - add GPT to suggest adjusting resume content by the given job description

## 9/27/2025
1) solved issue: 'ulblock' currently can be triggered by one click instead of  two clicks.
2) new bug: skill section, 'update' function binds to 'move up' function
   - fixed: IDK why this mistake existed since I did multiple tests/checks '_'
3) potential risk for use: may execute script if u load unknown json since no escape

## 9/26/2025
1) Remove optional widgets.awk

## 9/8/2025
1) Simplify CSS

## 8/13/2025
1) I installed my AC today! Great!
2) Instead of reviewing all code, I find and implement a workaround to solve the remaining issue.
3) I don't know if I will embed GPT since I don't need to edit my resume :(

## 8/11/2025
1) Skip "Info section should allow changing each detail name" because you can easily edit the element directly instead. 
2) Investigate cause of "Expected one copy but got multiple ones by exp section plus icon":
   - This is a common issue across all sections
   - Clicking the Add button once will add 2^n copies. The pattern is 1, 2, 4, 8...
   - The issue was caused by duplicate binding. 
   - The solution is easy: add a signal. But this means I have to go through all code again. 
   - Issue: Check 'edit.js' line 154.
3) Thus, I will fix the remaining "multiple copies" issue later due to no AC right now.

## 8/10/2025
1) Create the move-up function and bind it to the arrow-up icon.
2) Next: Fix the remaining issues.

## 8/9/2025
1) Add icons for each skill item for moving up but just UI without binding function(will be created later).
2) Change json storage option from localStorage to sessionStorage for "when editing". Why: 'localStorage' blocks my changes so that I have to manually clear 'localStorage'.
3) Next: Fix the remaining issues.

## 5/20
1) Add import button for loading the upload resume json file. Almost done.
2) Next: There may exist a few bugs. I will go through the code.
3) Issues:
   - Expected one copy but got multiple ones by exp section plus icon.
   - Cannot change order of li items.
   - Info section should allow changing each detail name.

## 5/18
1) Clean up.
