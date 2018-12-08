// extracts the tag without inner
<div>
  The content.
</div>

/* expected */
<div>
  The content.
</div>
/**/

// extracts the tag
<div>
  The content.
  <div>
    An inner tag
  </div>
</div>

/* expected */
<div>
  The content.
  <div>
    An inner tag
  </div>
</div>
/**/