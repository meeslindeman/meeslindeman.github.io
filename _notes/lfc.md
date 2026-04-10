---
title: Lorentz Linear Layer
date: 2026-04-09
description: From the Euclidean point-to-hyperplane formulation to the intrinsic Lorentz fully connected layer.
tags: [Hyperbolic, Deep Learning]
---

## Euclidean linear layer

The standard formulation of a linear layer is $z = Wx + b$. Each output dimension computes one scalar. But there is a geometric property that is used in the hyperbolic generalisation.

Each row $W^{(i)}$ of $W$ defines a hyper plane in the output space:

$$H_i = \{u \in \mathbb{R}^{D_{in}} \mid  w^{(i)\top}u + b_i = 0\} $$

The output $z_i = w^{(i)\top}x + b_i$ the signed, scaled distance from $x$ to this hyperplane:

$$ z_i = \| w^{(i)}\| \cdot d^{\text{signed}}(x, H_i) $$

So, a linear layer with $D_{out} = m$ places $m$ hyperplanes in the $D_{in}$-dimensional input space. The output vector $z \in \mathbb{R}^m$ is the coordinate of $x$ in the system defined by those $m$ boundaries giving one signed distance per hyperplane. The output is a stack of $D_{out}$ signed distances, which forms a new vector in $\mathbb{R}^{D_{out}}$ — a manufactured space whose axes are distances to boundaries.

### Example

In this example we pass a random point $x = [1,2]$ trough a linear layer $FC^{2 \times 3}$ without bias. 

<figure>
  <img src="/assets/images/notes/hyperplanes.png">
  <figcaption>Figure 1: Visualisation of the point-to-hyperplane formulation.</figcaption>
</figure>

If we were to place multiple layers $D_{in} \rightarrow D_{out} \rightarrow \ldots$, each layer produces a new point in a new space whose coordinates are the distances from the previous layer's representation to the current layer's hyperplanes.

## Lorentz Model

The $n$-dimensional Lorentz model (hyperboloid model) of hyperbolic space:

$$ \mathcal{L}^n_k = \{ x \in \mathbb{R}^{n+1} \mid \langle x,x\rangle_L = 1/k, x_0 >0   \} $$

With the Minkowski inner product:

$$ x \circ x = -x_t y_t + x_s^{\top} y_s$$

The hyperboloid is a curved surface embedded in flat Minkowski space $\mathbb{R}^{n+1}$. 

## Intrinsic Lorentz Layer[^1]

The analogue of a Euclidean hyperplane $\{u : w^{\top}u + b = 0 \}$ in hyperbolic space is a geodesic hypersurface: the intersection of an ambient Minkowski plane trough the origin of he hyperboloid:

$$ H_{w,b} = \{q \in \mathcal{L}^n_k \mid q \circ v =0 \} $$

The ambient Euclidean plane is just a description. The geodesic on the hyperboloid — the intersection — is the actual geometric object. Each hyperplane is parametrised by a Euclidean direction $u ∈ ℝⁿ$ (spatial orientation + distance scaling) and a bias $b ∈ ℝ$(displacement from origin). These assemble into a space-like normal vector:

$$ v = ( \|u\|_E \cdot \sinh(\sqrt{k} \cdot b \cdot \|u\|_E), \cosh(\sqrt{k} \cdot b \cdot \|u\|_E) \cdot u)^{\top} $$

The reference point $p$ (foot of the hyperplane from the origin) is:

$$ p = \exp_o ( -(b/ \|u\|_E) \cdot u/ \|u\|_E) $$

The signed hyperbolic distance from $x ∈ \mathcal{L}^n_k$ to $H_v$:

$$ d^{\text{signed}}  (x, H_v) = (1/\sqrt{k}) \cdot \text{arcsinh}(\sqrt{k} \cdot (x \circ v) / \|v\|_L) $$

The scaled version (used in the layer) moves the norm inside arcsinh:

$$ z = (1/\sqrt{k}) \cdot \text{arcsinh}(\sqrt{k} \cdot (x \circ v)) $$

Finally, activation $h$ is applied to $z$ and a point on $\mathcal{L}^{D_{out}}_k is constructed as the unique point whose signed distances to the $D_{out}$ coordinate hyperplanes equal $h(z)$:

$$ \overline{y} = h(z) = h(V \cdot I_{1,n} \cdot x)$$
$$ y_0 = \sqrt{1/k + \| \overline{y} \|^2_E}$$
$$ y = (y_0, \overline{y}) \in \mathcal{L}^{D_{out}}_k $$

Because $v$ contains $\sinh(\sqrt{k} \cdot b \cdot \|u\|)$ and $\cosh(\ldots)$, the entries of $V$ grow exponentially with $b$. Linear increase in $b$ so exponential growth in spatial output which results in linear growth in hyperbolic distance.

### Example

Similarly to the Euclidean version, we pass a random point $x$ trough a Lorentz linear layer $LFC^{2 \times 3}$ without bias. 

<figure>
  <img src="/assets/images/notes/lorentz_hyperplanes.png">
  <figcaption>Figure 2: Visualisation of the hyperbolic point-to-hyperplane formulation.</figcaption>
</figure>

The concept is similar, hyperplanes, and thus parameters are Euclidean (optimised with Adam in $ℝⁿ$), but they specify geodesic boundaries on the manifold. The layer measures hyperbolic distances to those boundaries and maps the result back to the manifold. Same job as a Euclidean layer; hyperbolic mechanism.

---

[^1]: van der Klis, R., Torres, R. C., van Spengler, M., Ding, Y., Hofmann, T., & Mettes, P. (2026). Fast and Geometrically Grounded Lorentz Neural Networks. arXiv preprint arXiv:2601.21529.

