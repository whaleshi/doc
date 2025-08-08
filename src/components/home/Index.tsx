import { MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import React, { useState, useMemo } from "react";
import { formatBigNumber } from "@/utils/formatBigNumber";

type FormatMode = "default" | "zeroCount" | "subscript";

const Home = () => {
	const [inputValue, setInputValue] = useState("1000.31234553345435");
	const [decimals, setDecimals] = useState(0);
	const [precision, setPrecision] = useState<number | undefined>(undefined);
	const [withComma, setWithComma] = useState(false);
	const [compact, setCompact] = useState(true);
	const [trimTrailingZero, setTrimTrailingZero] = useState(true);
	const [mode, setMode] = useState<FormatMode>("subscript");

	const formatted = useMemo(() => {
		return formatBigNumber(inputValue, {
			decimals,
			precision,
			withComma,
			compact,
			trimTrailingZero,
			mode,
		});
	}, [inputValue, decimals, precision, withComma, compact, trimTrailingZero, mode]);

	// 动态生成示例代码字符串
	const previewCode = useMemo(() => {
		const defaultOptions = {
			decimals: 0,
			precision: undefined,
			withComma: false,
			compact: true,
			trimTrailingZero: true,
			mode: 'subscript',
		};

		const currentOptions = {
			decimals,
			precision,
			withComma,
			compact,
			trimTrailingZero,
			mode,
		};

		// 只保留与默认值不同的选项
		const optionsStr = Object.entries(currentOptions)
			.filter(([key, val]) => val !== undefined && val !== defaultOptions[key as keyof typeof defaultOptions])
			.map(([key, val]) => `  ${key}: ${typeof val === 'string' ? `"${val}"` : val}`)
			.join(',\n');

		return `\`\`\`ts
formatBigNumber("${inputValue}"${optionsStr ? `, {\n${optionsStr}\n}` : ''});`;
	}, [inputValue, decimals, precision, withComma, compact, trimTrailingZero, mode]);

	return (
		<div style={{ maxWidth: 600, margin: "auto", padding: 20, fontFamily: "sans-serif" }}>
			<h1>formatBigNumber 调试器</h1>
			<label>
				输入数字:
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					style={{ width: "100%", marginBottom: 10 }}
					placeholder="请输入数字"
				/>
			</label>

			<label>
				decimals (精度):
				<input
					type="number"
					value={decimals}
					onChange={(e) => setDecimals(Number(e.target.value))}
					style={{ width: "100%", marginBottom: 10 }}
					min={0}
				/>
			</label>

			<label>
				precision (保留小数位数，留空自动):
				<input
					type="number"
					value={precision === undefined ? "" : precision}
					onChange={(e) =>
						setPrecision(e.target.value === "" ? undefined : Number(e.target.value))
					}
					style={{ width: "100%", marginBottom: 10 }}
					min={0}
				/>
			</label>

			<label>
				<input
					type="checkbox"
					checked={withComma}
					onChange={() => setWithComma(!withComma)}
				/>
				添加千位分隔符
			</label>

			<br />

			<label>
				<input
					type="checkbox"
					checked={compact}
					onChange={() => setCompact(!compact)}
				/>
				使用 K/M/B/Q 缩写
			</label>

			<br />

			<label>
				<input
					type="checkbox"
					checked={trimTrailingZero}
					onChange={() => setTrimTrailingZero(!trimTrailingZero)}
				/>
				去除末尾无意义的 0
			</label>

			<br />

			<label>
				模式:
				<select value={mode} onChange={(e) => setMode(e.target.value as FormatMode)}>
					<option value="default">default</option>
					<option value="zeroCount">zeroCount</option>
					<option value="subscript">subscript</option>
				</select>
			</label>

			<h2>格式化结果:</h2>
			<div
				style={{
					background: "#f0f0f0",
					padding: 20,
					fontSize: 24,
					borderRadius: 8,
					userSelect: "all",
					wordBreak: "break-word",
				}}
			>
				{formatted}
			</div>

			<h2>调用示例代码:</h2>
			<MdPreview theme="dark" modelValue={previewCode} />
		</div>
	);
};

export default Home;
