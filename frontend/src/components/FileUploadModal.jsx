import React, { useState, useRef } from 'react';
import { UploadCloud, X, CheckCircle2, AlertCircle, FileText, ArrowRight, Loader2, Sparkles, CreditCard, Building2 } from 'lucide-react';
import { financeApi } from '../api/client';

export default function FileUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Por favor, selecione um arquivo no formato .CSV");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Selecione um arquivo CSV antes de continuar.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const res = await financeApi.importCsv(file);
      setResult(res);
      if (onUploadSuccess) {
        onUploadSuccess(res);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Ocorreu um erro ao importar o arquivo CSV.");
    } finally {
      setUploading(false);
    }
  };

  // Carrega Extrato de Conta de Exemplo Anonimizado
  const handleUseAccountSample = async () => {
    setUploading(true);
    setError(null);
    try {
      const sampleCsv = `Data,Valor,Identificador,Descrição
01/07/2026,1000.00,6a44e995-9de6-46bf-8434-8a1510f91ad8,Transferência recebida pelo Pix - CLIENTE EXEMPLO A - •••.000.000-•• - BANCO EXEMPLO (0341) Agência: 0001 Conta: 12345-6
03/07/2026,2421.88,6a4766b5-4ace-44ba-98ef-aaaa9a9bcaf9,Transferência recebida pelo Pix - PAGADOR EXEMPLO B - •••.111.222-•• - BANCO EXEMPLO (0341) Agência: 0001 Conta: 65432-1
03/07/2026,-1874.22,6a4766d3-dbbf-4c77-a60e-374b451b26aa,Pagamento de fatura
03/07/2026,-107.79,6a476719-52a8-4464-b9b9-c822d5ee24b6,Transferência enviada pelo Pix - PAGAMENTOS DIGITAIS S A - 00.000.000/0001-00 - INSTITUICAO (0380) Agência: 1 Conta: 100000000-1
03/07/2026,-89.99,6a476767-2a9c-4ce3-be67-eb25a7bb2f4b,Transferência enviada pelo Pix - SERVICO DE INTERNET S.A. - 00.000.000/0001-00 - BANCO (0001) Agência: 1000 Conta: 5000-0
03/07/2026,-1117.61,6a476799-479f-4c4e-a7c0-a37a85166072,Aplicação RDB
05/07/2026,-4.50,6a4a5de7-bec4-41b8-9517-1942943634d4,Transferência enviada pelo Pix - CONTRIBUICAO COMUNITARIA - 00.000.000/0001-00 - COOPERATIVA Agência: 100 Conta: 10000-0
06/07/2026,600.00,6a4c38c4-e9e8-4e37-8f79-46ef8dcbd5c6,Transferência recebida pelo Pix - CLIENTE EXEMPLO C - •••.222.333-•• - BANCO EXEMPLO (0341) Agência: 0001 Conta: 78901-2
06/07/2026,500.00,6a4c4a81-800e-4905-98c3-f3656d5912a1,Transferência recebida pelo Pix - CLIENTE EXEMPLO D - •••.333.444-•• - INSTITUICAO PAGAMENTO (0197) Agência: 1 Conta: 90000000-0
11/07/2026,-20.00,6a5297a8-1468-4e1c-9a89-747b997b0f59,Transferência enviada pelo Pix - BENEFICIARIO EXEMPLO - •••.444.555-•• - BANCO FEDERAL (0104) Agência: 1000 Conta: 100000000000-0
12/07/2026,-1075.50,6a536202-7c53-4198-987a-2e9eff9dfb57,Aplicação RDB
12/07/2026,-4.50,6a539b49-4e89-49a9-b12a-7fdb304570a9,Transferência enviada pelo Pix - CONTRIBUICAO COMUNITARIA - 00.000.000/0001-00 - COOPERATIVA Agência: 100 Conta: 10000-0
16/07/2026,-20.00,6a59720a-0168-4b71-8ee1-1ebbc8bc02fa,Transferência enviada pelo Pix - BENEFICIARIO EXEMPLO - •••.444.555-•• - BANCO FEDERAL (0104) Agência: 1000 Conta: 100000000000-0
18/07/2026,1991.96,6a5b76c3-7d20-4863-828e-d760422e7d67,Transferência recebida pelo Pix - PAGADOR EXEMPLO B - •••.111.222-•• - BANCO EXEMPLO (0341) Agência: 0001 Conta: 65432-1
18/07/2026,-2000.46,6a5b771f-53ad-40bb-9871-177d07990530,Aplicação RDB
18/07/2026,-103.57,6a5bedfa-b871-4523-9066-de4ccdec7bf1,Transferência enviada pelo Pix - MERCADO EXEMPLO IP LTDA - 00.000.000/0001-00 - INSTITUICAO (0323) Agência: 1 Conta: 1000000000-0
19/07/2026,-100.00,6a5cbf71-729a-4e16-8300-5e1e047b4680,Transferência enviada pelo Pix - CONTATO EXEMPLO - •••.555.666-•• - INSTITUICAO (0260) Agência: 1 Conta: 4000000-0
19/07/2026,-4.50,6a5cd598-ee58-41ed-a16f-dc8f77faf56f,Transferência enviada pelo Pix - CONTRIBUICAO COMUNITARIA - 00.000.000/0001-00 - COOPERATIVA Agência: 100 Conta: 10000-0
23/07/2026,-30.00,6a62827f-41da-4f3f-81bf-ebe49edee20e,Transferência enviada pelo Pix - FORNECEDOR EXEMPLO - •••.666.777-•• - BANCO DIGITAL (0077) Agência: 1 Conta: 30000000-0
25/07/2026,-23.45,6a64de57-744e-4a78-8a73-22b324c8f688,Transferência enviada pelo Pix - SUPERMERCADO CENTRAL LJ01 - 00.000.000/0001-00 - COOPERATIVA Agência: 100 Conta: 80000-0
25/07/2026,-4.50,6a65355a-835f-4c56-bea5-d05ed5768856,Transferência enviada pelo Pix - CONTRIBUICAO COMUNITARIA - 00.000.000/0001-00 - COOPERATIVA Agência: 100 Conta: 10000-0
31/07/2026,980.00,6a6d3978-0c7e-4e91-96c3-a6fd3883ac6b,Transferência recebida pelo Pix - PAGADOR EXEMPLO B - •••.111.222-•• - BANCO EXEMPLO (0341) Agência: 0001 Conta: 65432-1
31/07/2026,-675.73,6a6d398f-4b91-496f-b589-798c2d47a07f,Pagamento de fatura
31/07/2026,-89.99,6a6d3aaa-a285-431f-ab60-92fddf235398,Transferência enviada pelo Pix - SERVICO DE INTERNET S.A. - 00.000.000/0001-00 - BANCO (0001) Agência: 1000 Conta: 5000-0
31/07/2026,-96.70,6a6d3aed-077a-4f75-ad21-14fd136d8012,Transferência enviada pelo Pix - PAGAMENTOS DIGITAIS S A - 00.000.000/0001-00 - INSTITUICAO (0380) Agência: 1 Conta: 100000000-1
31/07/2026,-99.90,6a6d3be1-009f-4794-8f02-c8c79abb6abf,Transferência enviada pelo Pix - MERCADO EXEMPLO IP LTDA - 00.000.000/0001-00 - INSTITUICAO (0323) Agência: 1 Conta: 1000000000-0`;

      const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
      const sampleFile = new File([blob], 'NU_extrato_conta_exemplo.csv', { type: 'text/csv' });
      
      const res = await financeApi.importCsv(sampleFile);
      setResult(res);
      if (onUploadSuccess) onUploadSuccess(res);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erro ao carregar extrato de exemplo.");
    } finally {
      setUploading(false);
    }
  };

  // Carrega Fatura de Cartão de Crédito de Exemplo Anonimizada
  const handleUseCardSample = async () => {
    setUploading(true);
    setError(null);
    try {
      const cardCsv = `date,title,amount
2026-06-27,Estabelecimento Comercial,"56,50"
2026-06-27,Uber - NuPay,"32,94"
2026-06-27,Estabelecimento Comercial,"11,00"
2026-06-27,Uber - NuPay,"26,16"
2026-06-26,Dl*Uberrides,"8,95"
2026-06-25,Dl*Google Youtub,"16,90"
2026-06-24,"Estorno de ""Apple.Com/Bill"" (Apple)","- 31,41"
2026-06-24,Uber - NuPay,"19,98"
2026-06-24,Uber - NuPay,"- 19,98"
2026-06-24,Uber - NuPay,"17,94"
2026-06-21,Barbearia Local,"85,00"
2026-06-21,Pizzaria Exemplo,"221,00"
2026-06-21,Loja de Roupas,"89,90"
2026-06-20,Mercadao Central,"19,57"
2026-06-20,Uber - NuPay,"16,95"
2026-06-20,Uber - NuPay,"21,93"
2026-06-19,"Estorno de ""Apple.Com/Bill"" (Apple)","- 28,90"
2026-06-19,Apple.Com/Bill,"34,90"
2026-06-19,Restaurante Grill,"59,98"
2026-06-19,Restaurante Grill,"14,00"
2026-06-19,Supermercado Central,"20,47"
2026-06-17,Amazon,"37,02"
2026-06-16,Amazonprimebr,"9,90"
2026-06-16,Mercadolivre*Loja - Parcela 1/2,"34,96"
2026-06-15,Apple.Com/Bill,"28,90"
2026-06-14,Nova Moda Magazine,"55,98"
2026-06-14,Mercadao Central,"12,70"
2026-06-14,Mercadao Central,"24,98"
2026-06-13,Loja de Cosmeticos,"108,90"
2026-06-12,Perfumaria Exemplo,"35,98"
2026-06-12,Outlet Premium,"99,90"
2026-06-12,Chocolateria Exemplo,"56,94"
2026-06-12,Chocolateria Premium,"76,50"
2026-06-12,Academia Exemplo,"19,60"
2026-06-11,Apple.Com/Bill,"5,90"
2026-06-11,Padaria Exemplo,"47,97"
2026-06-10,Prestador de Servicos,"10,00"
2026-06-10,Dl*Uberrides,"12,94"
2026-06-07,Mercadao Central,"5,99"
2026-06-07,Uber - NuPay,"14,94"
2026-06-05,Prestador de Servicos,"24,00"
2026-06-02,Mercadolivre*Loja - Parcela 1/2,"143,33"
2026-06-02,Uber - NuPay,"10,96"
2026-06-01,Mercadao Central,"23,07"
2026-06-01,Mercado Uniao,"10,29"
2026-06-01,Restaurante Local,"83,80"
2026-05-31,Loja Virtual,"39,98"
2026-05-31,Dm*Spotify,"12,90"
2026-05-31,Supermercado Central,"19,58"
2026-05-30,Supermercados Rede,"8,48"
2026-05-30,Fast Food App,"47,90"
2026-05-29,Pagamento recebido,"- 743,95"
2026-05-29,Shopee *Loja - Parcela 2/2,"56,15"`;

      const blob = new Blob([cardCsv], { type: 'text/csv;charset=utf-8;' });
      const sampleFile = new File([blob], 'NU_fatura_cartao_exemplo.csv', { type: 'text/csv' });
      
      const res = await financeApi.importCsv(sampleFile);
      setResult(res);
      if (onUploadSuccess) onUploadSuccess(res);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erro ao carregar fatura de exemplo.");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Importar Extrato ou Fatura</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Auto-detecta extrato de conta ou fatura de cartão Nubank</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-4">
          {!result ? (
            <>
              {/* Dropzone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 scale-[1.01]'
                    : file
                    ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/20'
                    : 'border-slate-300 dark:border-slate-700 hover:border-emerald-400 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                {file ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
                      <FileText className="w-8 h-8" />
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{file.name}</span>
                    <span className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1">Clique para trocar de arquivo</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2.5">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Arraste o arquivo CSV aqui ou <span className="text-emerald-600 dark:text-emerald-400 underline">procure no computador</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Formatos: <code className="text-slate-600 dark:text-slate-400">Data,Valor,Identificador,Descrição</code> ou <code className="text-slate-600 dark:text-slate-400">date,title,amount</code>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Botões de Atalho para dados de Exemplo */}
              <div className="space-y-2 pt-1">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Ou carregue dados de teste com 1 clique:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleUseAccountSample}
                    disabled={uploading}
                    className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Extrato Conta (Exemplo)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleUseCardSample}
                    disabled={uploading}
                    className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-bold text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-800 transition-colors"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Fatura Cartão (Exemplo)</span>
                  </button>
                </div>
              </div>

              {/* Mensagem de Erro */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </>
          ) : (
            /* Sucesso */
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Arquivo Processado!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">{result.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-center pt-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700">
                  <span className="block text-xs text-slate-500 dark:text-slate-400 font-medium">Novas Gravadas</span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{result.totalImported}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700">
                  <span className="block text-xs text-slate-500 dark:text-slate-400 font-medium">Duplicadas Puladas</span>
                  <span className="text-xl font-extrabold text-slate-600 dark:text-slate-300">{result.totalSkippedDuplicates}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {result ? "Fechar" : "Cancelar"}
          </button>

          {!result && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`inline-flex items-center px-5 py-2 text-xs font-bold rounded-xl text-white shadow-md transition-all ${
                !file || uploading
                  ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed shadow-none'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  Importar Agora
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
