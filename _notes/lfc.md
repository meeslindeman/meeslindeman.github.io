---
title: Lorentz Linear Layer
date: 2026-04-09
description: From the Euclidean point-to-hyperplane formulation to the intrinsic Lorentz fully connected layer.
tags: [Hyperbolic, Deep Learning]
---

## Euclidean linear layer

The standard formulation of a linear layer is $z = Wx + b$. Each output dimension computes one scalar. But there is a geometric property that is used in the hyperbolic generalisation.

Each row $W^{(i)}$ of $W$ defines a hyper plane in the output space:

$$H_i = \{u \in \mathbb{R}^{D_{in}} |  w^{(i)\top}u + b_i = 0\} $$

The output $z_i = w^{(i)\top}x + b_i$ the signed, scaled distance from $x$ to this hyperplane:

$$ z_i = \| w^{(i)}\| \cdot d^{\text{signed}}(x, H_i) $$

So, a linear layer with $D_{out} = m$ places $m$ hyperplanes in the $D_{in}$-dimensional input space. The output vector $z \in \mathbb{R}^m$ is the coordinate of $x$ in the system defined by those $m$ boundaries giving one signed distance per hyperplane. The output is a stack of $D_{out}$ signed distances, which forms a new vector in $\mathbb{R}^{D_{out}}$ — a manufactured space whose axes are distances to boundaries.

### Example

In this example we pass a random point $x = [1,2]$ trough a linear layer $FC^{2 \times 3}$ without bias. 

<figure>
  <img src="/assets/images/notes/hyperplanes.png">
  <figcaption>Figure 1: Description here</figcaption>
</figure>

If we were to place multiple layers $D_{in} \rightarrow D_{out} \rightarrow \ldots$, each layer produces a new point in a new space whose coordinates are the distances from the previous layer's representation to the current layer's hyperplanes.

## Lorentz Model

The $n$-dimensional Lorentz model (hyperboloid model) of hyperbolic space:

$$ \mathcal{L}^n_k = \{ x \in \mathbb{R}^{n+1} | \langle x,x\rangle_L = 1/k, x_0 >0   \} $$

With the Minkowski inner product:

$$ x \circ x = -x_t y_t + x_s^{\top} y_s$$

The hyperboloid is a curved surface embedded in flat Minkowski space $\mathbb{R}^{n+1}$. 

## Three approaches to a hyperbolic linear layer

### Approach 1: Tangent space (Ganea[^1], Shimizu[^1])



[^1]: Nair, V. & Hinton, G. (2010). Rectified Linear Units Improve Restricted Boltzmann Machines. *ICML*.