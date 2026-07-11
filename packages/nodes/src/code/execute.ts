import { NodeType, NodeExecutor } from '../types';
import { getQuickJS } from 'quickjs-emscripten';

export const executeCode: NodeExecutor = {
  type: NodeType.CODE,
  async execute(config, input) {
    const code = config.code as string;
    if (!code) return { result: input };

    try {
      const QuickJS = await getQuickJS();
      const vm = QuickJS.newContext();
      
      // Definições de limite e segurança
      vm.runtime.setMemoryLimit(1024 * 1024 * 64); // 64 MB
      vm.runtime.setMaxStackSize(1024 * 1024); // 1 MB
      // Timeout de 5s simulado com interruption handler se suportado
      let cycles = 0;
      vm.runtime.setInterruptHandler(() => {
        cycles++;
        if (cycles > 100000) return true; // Interrompe código longo/loop infinito
        return false;
      });

      // Pass input via global variable safely
      const inputStr = JSON.stringify(input || {});
      const codeToRun = `
        const input = ${inputStr};
        ${code}
      `;

      const result = vm.evalCode(codeToRun);
      
      if (result.error) {
        const errorMsg = vm.dump(result.error);
        result.error.dispose();
        vm.dispose();
        throw new Error(errorMsg);
      } else {
        const resultValue = vm.dump(result.value);
        result.value.dispose();
        vm.dispose();
        return { result: resultValue };
      }
    } catch (error) {
      throw new Error(`Code execution error: ${(error as Error).message}`);
    }
  }
};
