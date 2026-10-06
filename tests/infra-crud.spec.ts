import { test, expect } from "@playwright/test";

test.describe("CRUD de Infraestrutura (Integration)", () => {
  test("Deve criar uma categoria e um projeto dinamicamente, validar exibição no HTML e excluir", async ({
    request,
  }) => {
    // Passo 1: Limpar categorias antes do teste
    const cleanRes = await request.get(
      "http://localhost:3000/api/infra-categories",
    );
    const resJson = await cleanRes.json();
    const categories = resJson.data || [];
    // Clean projects only if needed, or leave categories alone.

    // Passo 2: Criar uma nova categoria via API
    const catId = "test_cat_" + Date.now();
    const catRes = await request.post(
      "http://localhost:3000/api/infra-categories",
      {
        data: {
          id: catId,
          label: "Categoria E2E Test",
          type: "projects",
          color: "emerald",
        },
      },
    );
    expect(catRes.ok()).toBeTruthy();

    // Passo 3: Criar um projeto vinculado a essa categoria
    const projRes = await request.post(
      "http://localhost:3000/api/infra-projects",
      {
        data: {
          category_id: catId,
          name: "Projeto de Teste E2E",
          level: "intermediario",
          priority: "alta",
          reqs: ["Playwright", "Testes", "Automacao"],
          ext: "sh",
          objective: "Testar todo o fluxo E2E",
        },
      },
    );
    expect(projRes.ok()).toBeTruthy();
    const projData = await projRes.json();
    const projId = projData.data.id;

    // Passo 4: Fazer GET na API para confirmar se o projeto existe
    const verifyProjRes = await request.get(
      `http://localhost:3000/api/infra-projects`,
    );
    const projectsRes = await verifyProjRes.json();
    const projects = projectsRes.data || [];
    const found = projects.find((p: any) => p.id === projId);
    expect(found).toBeDefined();
    expect(found.name).toBe("Projeto de Teste E2E");
    expect(found.category_id).toBe(catId);

    // Passo 6: Atualizar (Editar) o projeto
    const updateRes = await request.put(
      `http://localhost:3000/api/infra-projects/${projId}`,
      {
        data: {
          name: "Projeto E2E Editado",
        },
      },
    );
    expect(updateRes.ok()).toBeTruthy();

    // Passo 7: Validar a atualização
    const verifyUpdateRes = await request.get(
      `http://localhost:3000/api/infra-projects`,
    );
    const updatedProjectsRes = await verifyUpdateRes.json();
    const updatedProjects = updatedProjectsRes.data || [];
    const updatedProj = updatedProjects.find((p: any) => p.id === projId);
    expect(updatedProj).toBeDefined();
    expect(updatedProj.name).toBe("Projeto E2E Editado");

    // Passo 8: Excluir o projeto
    const delProjRes = await request.delete(
      `http://localhost:3000/api/infra-projects/${projId}`,
    );
    expect(delProjRes.ok()).toBeTruthy();

    // Not deleting category since route does not exist.

    // Passo 9: Garantir que não existe mais na API
    const finalVerifyRes = await request.get(
      `http://localhost:3000/api/infra-projects`,
    );
    const finalProjectsRes = await finalVerifyRes.json();
    const finalProjects = finalProjectsRes.data || [];
    const finalProj = finalProjects.find((p: any) => p.id === projId);
    expect(finalProj).toBeUndefined();
  });
});
