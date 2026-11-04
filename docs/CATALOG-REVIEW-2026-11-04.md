# Catalog coverage review, 4 November 2026

The refresh repair and the model list are separate jobs. The weekly workflow derives figures
for the existing curated seeds and proposes a pull request; it does not add new models or
publish without a merge. The candidate report is a review queue, not a list of supported models
that can safely be appended.

This assessment checks the highest-impact gaps against live Hugging Face configurations and the
generator's current guards. It does not claim exhaustive classification or certify any new seed.
No model was added as part of the refresh repair.

## Priorities

### 1. Qwen3-VL: focused catalog work

The 8B and 4B Instruct variants were high in the current discovery results, at approximately
7.0M and 3.9M rolling downloads respectively. Their text stacks use familiar GQA shapes:

- [8B configuration](https://huggingface.co/Qwen/Qwen3-VL-8B-Instruct/raw/main/config.json):
  36 layers, hidden size 4096, 32 query heads, 8 KV heads, head dimension 128, context 262144.
- [4B configuration](https://huggingface.co/Qwen/Qwen3-VL-4B-Instruct/raw/main/config.json):
  36 layers, hidden size 2560, 8 KV heads, head dimension 128 and tied embeddings.
- [30B-A3B configuration](https://huggingface.co/Qwen/Qwen3-VL-30B-A3B-Instruct/raw/main/config.json):
  48 layers, hidden size 2048, 128 experts with 8 active, expert intermediate size 768 and
  4 KV heads of dimension 128. This is also a familiar text-engine shape.

There is a concrete classification blocker. The
[8B tensor index](https://huggingface.co/Qwen/Qwen3-VL-8B-Instruct/raw/main/model.safetensors.index.json)
contains `model.visual.blocks.*` and `model.visual.deepstack_merger_list.*`. The generator's
non-language prefixes do not include `visual.`. After that classification misses, the broad
`model.` language prefix accepts these tensors, incorrectly charging the vision tower to each
text token's decode traffic.

The next safe step is a focused catalog change with tested flat and nested `visual.` classification,
then pinned-header derivation, output-table/tied-embedding checks and model/runtime verification.
Merely appending seeds is unsafe. This work is narrower than implementing a new attention family.

### 2. Qwen3.8: hybrid/recurrent engine support

[Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B/raw/main/config.json) has 64 layers,
including 48 linear and 16 full-attention layers, `full_attention_interval: 4`, recurrent-state
fields and an MTP declaration. It had approximately 8.0M rolling downloads when checked.

The current linear-stack guard correctly refuses it. Supporting this family needs recurrent-state
capacity and compute accounting, with runtime-specific storage evidence. Treating all 64 layers
as ordinary GQA would produce misleading hardware estimates.

### 3. GLM-5.3-Flash and DeepSeek-V4: sparse and hybrid attention

- [GLM-5.3-Flash](https://huggingface.co/zai-org/GLM-5.3-Flash/raw/main/config.json) combines
  34 linear layers with 11 sparse-attention layers. It declares `kv_lora_rank: 512`,
  `index_n_heads: 32`, `index_head_dim: 128`, `index_topk: 2048` and `index_kpool: 4`.
  It needs both recurrent-stack and sparse-index/cache modeling, not just another MLA seed.
- [DeepSeek-V4-Flash-0731](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731/raw/main/config.json)
  has 43 layers, a sparse indexer with `index_topk: 512`, 64 index heads of dimension 128,
  sliding window 128, alternating compression ratios 4/128, FP4 experts and MTP.
  The sparse-index guard correctly refuses it. Existing MLA/GQA accounting does not cover this
  architecture.

These models had approximately 6.3M and 2.9M rolling downloads respectively when checked.
Downloads prioritize investigation; they do not establish support.

### 4. Granite 4.1 3B: lower-priority candidate

[Granite 4.1 3B](https://huggingface.co/ibm-granite/granite-4.1-3b/raw/main/config.json) uses
conventional dense Granite: 40 layers, hidden size 2560, 40 query heads, 8 KV heads, derived
head dimension 64, context 131072 and tied embeddings. No new attention family appears necessary.

Full pinned tensor derivation remains unverified. Existing small models and the seeded Granite
8B also reduce the incremental hardware coverage. It is a candidate for verification, not a
ready addition.

## Limits and next work

- Sources above are the live configurations read on the review date. Implementation must resolve
  and record exact revisions before deriving new catalog rows.
- Discovery also surfaces OCR models, derivatives and already-covered hardware shapes. Its total
  is not a count of missing supported models.
- The findings above are based on individually inspected sources, not an exhaustive compatibility
  pass across every discovery result.
- Keep the refresh repair independent. Then prioritize the Qwen3-VL classification and validation
  work, followed by a separately scoped hybrid/recurrent engine design.
