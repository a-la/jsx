## gets quoted
test

/* expected */
`test`
/**/

## gets quoted with new lines before

  test

/* expected */

  `test`
/**/

## gets quoted with new lines after
test



/* expected */
`test`


/**/

## gets quoted with new lines before and after

  test


/* expected */

  `test`

/**/

## gets quoted without any



/* expected */


/**/