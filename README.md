# Seesaw Simulation (Oğuzhan AYDIN)


## Thought Process and Design Decisions

I aimed to keep the **user interface modern and simple**, focusing on clarity and usability.  
I worked in small, testable steps — verifying each change before moving on.

At first, I implemented object placement using a **clickable background**, which didn’t require complex coordinate math.  
However, after re-reading the project requirement:

> *“The clickable area should be limited to the seesaw plank itself, not the background.”*

I updated the logic to ensure clicks are only detected on the plank surface and that object positions are calculated based on the **current rotation angle** of the plank.

---

## Trade-offs and Limitations
 
- Calculating positions relative to a **rotated coordinate system** required extra trigonometric logic, slightly increasing code complexity.

---

## AI Assistance

I used AI support to understand and apply the **mathematical formulas** for transforming click coordinates when the plank is tilted.  
With that help, I updated my JavaScript logic so that objects are placed precisely on the plank regardless of its rotation.

---

**Demo:**  
`https://ner1a.github.io/seesaw-oguzhan-aydin`
