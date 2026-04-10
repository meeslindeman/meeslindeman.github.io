---
title: Lorentz RMSNorm
date: 2026-04-09
description: Derivation of a Lorentz RMSNorm variant.
tags: [Hyperbolic, Deep Learning]
---

## Euclidean RMSNorm

In Eculidean space, RMSNorm[^1] normlaizes a vector $x \in \mathbb{R}^n$ by its RMS magnitude and rescales by a learned $\gamma$:

$$ \text{RMSNorm}(\mathbf{x}) = \gamma \cdot \frac{\mathbf{x}}{\|\mathbf{x}\|/\sqrt{n}} $$

This is radial rescaling, it moves $\mathbf{x}$ along the ray through the origin to a target norm $\gamma \sqrt{n}$ preserving direction. The learned $\gamma$ controls the target scale.

## Hyperbolic Analogue

The natural generalization replaces:
* The Euclidean norm $\|\mathbf{x}\|$ with the hyperbolic norm $\|x\|_{L} = d_{\mathcal{L}}(o,x)$, the geodesic distance from the origin
* Radial rescaling in $\mathbb{R}^n$ with geodesic scaling along the unique geodesic through the origin and $x$, which is the gyroscalar multiplication $\odot$

For $x \in \mathcal{L}^n_k$, the hyperbolic norm is:

$$ \|x\|_{L} = d_{\mathcal{L}}(o,x) = \frac{1}{\sqrt{-k}}\text{arccosh}(\sqrt{-k} \cdot x_0)$$

where $x_0$ is the time component of $x$ and $o = (1/\sqrt{-k}, \mathbf{0})$ is the origin.

Lorentz RMSNorm rescales each token to a learned target hyperbolic norm $\gamma > 0$ via gyroscalar multiplication:

$$ \text{LRMSNom}(x) = \frac{\gamma}{\| x \|_L} \odot x $$

where gyroscalar multiplication $t \odot x = \text{Exp}_o(t \cdot \text{Log}_o(x))$ moves $x$ along the geodesic through the origin by factor $t$. Since 

$$ d_{\mathcal{L}}(o, t \odot x) = t d_{\mathcal{L}}(o,x)$$

if follows that $\| \text{LRMSNorm}(x)\|_L$ has geodesic radius $\gamma$ exactly. As $k \to 0$, LRMSNorm reduces to Euclidean RMSNorm with a scalar $\gamma$. 

[^1]: Zhang, B., & Sennrich, R. (2019). Root mean square layer normalization. Advances in neural information processing systems, 32.