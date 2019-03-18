## makes an object body with one property.
{"test":"'ok'"}

/* expected */
{test:'ok'}
/**/

## makes an object body with multiple properties.
{"test":"'ok'","test2":"5"}

/* expected */
{test:'ok',test2:5}
/**/

## returns null when no keys are given
{ }

/* expected */
{}
/**/
