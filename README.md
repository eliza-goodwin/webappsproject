# My Project

## Meal Planner

### Plans

Attributes:

- Day
- Name of meal
- Date
- Servings
- Category

## Schema
```sql
CREATE TABLE plans (
    ID INTEGER PRIMARY KEY,
    day TEXT,
    name TEXT,
    date TEXT,
    serving INTEGER,
    category TEXT
);
```
### REST Endpoints
| Name                 | Method  | Path         |
|----------------------|---------|--------------|
| Retrieve all plans   | GET     | /plans       |
| Retrieve plan member | GET     | /plans/\<id> |
| Create plan member   | POST    | /plans       |
| Update plan member   | PUT     | /plans/\<id> |
| Delete plan member   | DELETE  | /plans/\<id> |


[Link to external site where I spent a lot of time](https://css-tricks.com/snippets/css/complete-guide-grid/#prop-grid-template-columns-rows)