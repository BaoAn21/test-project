
# I-ON Coding Test

This is my github project for I-ON coding test


## Tech Stack

**Client:** Nuxt3, Vue3.


## Installation

My project uses no addition package/tool (just Nuxt and Vue) so simply clone the project and run

```bash
  git clone https://github.com/BaoAn21/test-project
  cd test-project
  yarn install / npm install
  yarn dev / npm run dev
```
    
## Overview

- When first load admin page, data from local storage will be displayed (data after pressing Save).
- Save button will  save data in JSON format to local storage, which means data will be saved even when closing browser
- Undo button: after adding a component, user can undo to remove that component.
- Redo button: adding back a component that have just Undo
- Export button: save data in JSON format into a text file, user can find it under Download directory(data.txt).
- Import button: chosing a text file(data.txt), all components in that file will be display. If text file contains wrong data, nothing happen.
- View button: open new tab and direct to customer page, where customer can use component which are created by admin.



