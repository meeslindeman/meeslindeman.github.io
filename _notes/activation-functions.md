---
title: Activation Functions
date: 2026-04-09
description: A reference on common activation functions in neural networks — their definitions, properties, and when to use them.
tags: [deep learning, neural networks]
---

Activation functions introduce non-linearity into neural networks, enabling them to learn complex mappings. Without them, a deep network would collapse to a single linear transformation.

## ReLU

The **Rectified Linear Unit** is the most widely used activation function:

$$f(x) = \max(0, x)$$

Its derivative is simple:

$$f'(x) = \begin{cases} 1 & x > 0 \\ 0 & x \leq 0 \end{cases}$$

**Properties:**
- Computationally cheap
- Sparse activation (dead neurons possible)
- Does not saturate for positive values

The *dying ReLU* problem occurs when neurons get stuck outputting zero for all inputs. Leaky ReLU addresses this by allowing a small negative slope $\alpha$:

$$f(x) = \begin{cases} x & x > 0 \\ \alpha x & x \leq 0 \end{cases}$$

## Sigmoid

$$\sigma(x) = \frac{1}{1 + e^{-x}}$$

Maps any real value to $(0, 1)$, making it useful for binary output layers. However, it saturates at both ends, leading to vanishing gradients in deep networks.

The derivative is conveniently expressed as:

$$\sigma'(x) = \sigma(x)(1 - \sigma(x))$$

## Softmax

For multi-class output layers, softmax converts a vector $\mathbf{z} \in \mathbb{R}^K$ to a probability distribution:

$$\text{softmax}(\mathbf{z})_i = \frac{e^{z_i}}{\sum_{j=1}^{K} e^{z_j}}$$

Note that $\sum_i \text{softmax}(\mathbf{z})_i = 1$ by construction.

## GELU

The **Gaussian Error Linear Unit** has become common in transformer architectures:

$$\text{GELU}(x) = x \cdot \Phi(x)$$

where $\Phi(x)$ is the CDF of the standard normal distribution. In practice it is often approximated as:

$$\text{GELU}(x) \approx 0.5x\left(1 + \tanh\!\left[\sqrt{\frac{2}{\pi}}\left(x + 0.044715x^3\right)\right]\right)$$

Unlike ReLU, GELU is smooth and non-monotonic, which seems to help in attention-based models.

## Comparison

| Function | Range | Smooth | Saturates |
|----------|-------|--------|-----------|
| ReLU     | $[0, \infty)$ | No | No (positive) |
| Sigmoid  | $(0, 1)$ | Yes | Yes |
| Tanh     | $(-1, 1)$ | Yes | Yes |
| GELU     | $\approx(-0.17, \infty)$ | Yes | No |
