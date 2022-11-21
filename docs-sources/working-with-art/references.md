The References view shows how Art elements reference each other. Depending on what kind of reference you are interested in, there are different commands to use.

## Referencing Elements
To find all elements that reference a certain Art element, right-click on the name of the Art element (it must have a name, otherwise it cannot be referenced) and perform the context menu command **Find All References**. The References view will in this case list all referencing elements, and group them by the Art file where they are located. For example, it could look like this if the command was invoked on a state.

![](images/references.png)

Double-click the items in the References view to navigate to the referencing element in the Art file. You can remove a referencing element from the view by clicking the **Dismiss** (x) button. This can for example be useful if you are going through a large list of references and want to remove those you have already examined to make the list more manageable. You can restore all referenced element to be shown again by pressing the **Refresh** button in the toolbar.

An alternative way of finding and going through all referencing elements is to instead use the context menu command **Go to References**. This commands works the same as **Find All References** but will show the referencing elements inline in a popup in the Art editor instead of using the References view. 

![](images/go-to-references.png)

## Type Hierarchy
To find how Art elements relate to each other in terms of inheritance, right click on the name of an Art element that can be inherited (i.e. a class, capsule or protocol) and perform the context menu command **Show Type Hierarchy**. The References view will show the subtypes or supertypes of the selected Art element. For example:

![](images/type-hierarchy.png)

Use the leftmost toolbar button to toggle between showing subtypes or supertypes. Double-click on items in the tree to navigate to a subtype or supertype.

Note that an alternative to using the References view for looking at type hierarchies is to visualize them graphically using class diagrams (see [Diagrams](diagrams.md)).
